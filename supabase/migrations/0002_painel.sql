-- HL Parfums — suporte ao painel: lixeira, histórico de preço, limpeza automática

-- Lixeira
alter table public.products drop constraint if exists products_status_check;
alter table public.products add constraint products_status_check
  check (status in ('active', 'sold_out', 'hidden', 'trashed'));
alter table public.products add column if not exists trashed_at timestamptz;

-- A loja só enxerga disponíveis e esgotados
drop policy if exists "público lê perfumes visíveis" on public.products;
create policy "público lê perfumes visíveis" on public.products
  for select using (status in ('active', 'sold_out') or public.is_admin());

-- Histórico de preço (preenchido automaticamente)
create table if not exists public.price_history (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products (id) on delete cascade,
  old_price numeric(10, 2),
  new_price numeric(10, 2),
  changed_by uuid default auth.uid(),
  changed_at timestamptz not null default now()
);
create index if not exists price_history_product_idx on public.price_history (product_id, changed_at desc);
alter table public.price_history enable row level security;
drop policy if exists "admin lê histórico" on public.price_history;
create policy "admin lê histórico" on public.price_history for select using (public.is_admin());

create or replace function public.log_price_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.price is distinct from old.price then
    insert into public.price_history (product_id, old_price, new_price) values (new.id, old.price, new.price);
  end if;
  return new;
end $$;
drop trigger if exists products_price_log on public.products;
create trigger products_price_log after update of price on public.products
  for each row execute function public.log_price_change();

-- Limpeza da lixeira: apaga de vez o que está lá há mais de 30 dias (todo dia às 4h UTC)
create extension if not exists pg_cron with schema pg_catalog;
select cron.unschedule('hl-limpa-lixeira') where exists (select 1 from cron.job where jobname = 'hl-limpa-lixeira');
select cron.schedule(
  'hl-limpa-lixeira',
  '0 4 * * *',
  $$delete from public.products where status = 'trashed' and trashed_at < now() - interval '30 days'$$
);

-- Administrador inicial (login 79999938117)
insert into public.admins (user_id, role)
select id, 'owner' from auth.users where email = '79999938117@hlparfums.app'
on conflict (user_id) do nothing;

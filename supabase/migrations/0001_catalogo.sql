-- HL Parfums — estrutura do catálogo e configurações
-- Leitura pública só do que está ativo; escrita apenas por usuários do painel (tabela admins).

create extension if not exists "pgcrypto";

-- Quem pode entrar no painel
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- Marcas
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  is_arabic boolean not null default true,
  created_at timestamptz not null default now()
);

-- Categorias (Árabes, Importados, Nicho…)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  position int not null default 0,
  coming_soon boolean not null default false,
  created_at timestamptz not null default now()
);

-- Perfumes
create table public.products (
  id uuid primary key default gen_random_uuid(),
  ref text unique,                       -- referência do catálogo original (WhatsApp)
  slug text not null unique,
  name text not null,
  brand_id uuid not null references public.brands (id),
  category_id uuid not null references public.categories (id),
  gender text not null check (gender in ('Feminino', 'Masculino', 'Unissex')),
  price numeric(10, 2),                  -- nulo = "Consulte"
  size text not null default '',
  description text not null default '',
  notes_top text not null default '',
  notes_heart text not null default '',
  notes_base text not null default '',
  status text not null default 'active' check (status in ('active', 'sold_out', 'hidden')),
  featured boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_brand_idx on public.products (brand_id);
create index products_category_idx on public.products (category_id);
create index products_status_idx on public.products (status);

-- Fotos (a primeira por posição é a capa)
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  path text not null,                    -- caminho no bucket "fotos"
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index product_images_product_idx on public.product_images (product_id, position);

-- Configurações da loja (uma linha)
create table public.settings (
  id int primary key default 1 check (id = 1),
  whatsapp text not null default '5579999938117',
  whatsapp_message text not null default 'Olá, gostaria de mais informações sobre o {perfume}.',
  instagram text not null default '',
  hours text not null default '',
  topbar_text text not null default 'Pedidos e atendimento pelo WhatsApp · Envio para todo o Brasil',
  updated_at timestamptz not null default now()
);
insert into public.settings (id) values (1);

-- Cliques (relatório simples)
create table public.events (
  id bigint generated always as identity primary key,
  product_id uuid references public.products (id) on delete set null,
  kind text not null check (kind in ('view', 'whatsapp')),
  created_at timestamptz not null default now()
);
create index events_product_idx on public.events (product_id, kind, created_at);

-- updated_at automático
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.settings for each row execute function public.touch_updated_at();

-- RLS
alter table public.admins enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.settings enable row level security;
alter table public.events enable row level security;

create policy "admins leem admins" on public.admins for select using (public.is_admin());

create policy "público lê marcas" on public.brands for select using (true);
create policy "admin gerencia marcas" on public.brands for all using (public.is_admin()) with check (public.is_admin());

create policy "público lê categorias" on public.categories for select using (true);
create policy "admin gerencia categorias" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "público lê perfumes visíveis" on public.products for select using (status <> 'hidden' or public.is_admin());
create policy "admin gerencia perfumes" on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "público lê fotos" on public.product_images for select using (true);
create policy "admin gerencia fotos" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

create policy "público lê configurações" on public.settings for select using (true);
create policy "admin altera configurações" on public.settings for update using (public.is_admin()) with check (public.is_admin());

create policy "público registra clique" on public.events for insert with check (kind in ('view', 'whatsapp'));
create policy "admin lê cliques" on public.events for select using (public.is_admin());

-- Bucket de fotos (leitura pública, escrita só do painel)
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true)
  on conflict (id) do nothing;
create policy "público lê fotos do bucket" on storage.objects for select using (bucket_id = 'fotos');
create policy "admin envia fotos" on storage.objects for insert with check (bucket_id = 'fotos' and public.is_admin());
create policy "admin altera fotos" on storage.objects for update using (bucket_id = 'fotos' and public.is_admin());
create policy "admin remove fotos" on storage.objects for delete using (bucket_id = 'fotos' and public.is_admin());

'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, GENDERS, slugify } from '@/lib/types';
import type { Brand, Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { waLink } from '@/lib/site';

const SORTS = [
  { v: '', label: 'Destaques' },
  { v: 'menor', label: 'Menor preço' },
  { v: 'maior', label: 'Maior preço' },
  { v: 'az', label: 'A–Z' },
];

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function CatalogBrowser({ products, brands }: { products: Product[]; brands: Brand[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const allBrands = useMemo(() => [...brands].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')), [brands]);

  const genero = sp.get('genero') || '';
  const categoria = sp.get('categoria') || '';
  const marca = sp.get('marca') || '';
  const q = sp.get('q') || '';
  const ordem = sp.get('ordem') || '';

  const set = (key: string, val: string) => {
    const next = new URLSearchParams(sp.toString());
    if (val) next.set(key, val);
    else next.delete(key);
    router.replace(`${pathname}${next.toString() ? `?${next}` : ''}`, { scroll: false });
  };

  const cat = CATEGORIES.find((c) => c.slug === categoria);
  const gen = GENDERS.find((g) => g.slug === genero);
  const brand = allBrands.find((b) => b.slug === marca);

  const list = useMemo(() => {
    let l = products.slice();
    if (gen) l = l.filter((p) => p.gender === gen.label);
    if (cat) l = l.filter((p) => slugify(p.category) === cat.slug);
    if (brand) l = l.filter((p) => p.brand === brand.name);
    if (q) {
      const t = norm(q);
      l = l.filter((p) => norm(`${p.name} ${p.brand}`).includes(t));
    }
    if (ordem === 'menor') l.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (ordem === 'maior') l.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (ordem === 'az') l.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return l;
  }, [products, gen, cat, brand, q, ordem]);

  const title = brand ? brand.name : cat ? `Perfumes ${cat.label}` : gen ? gen.plural : q ? `Busca: “${q}”` : 'Todos os perfumes';

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow in1" style={{ color: 'var(--gold)' }}>Catálogo HL</span>
          <h1 className="serif in2">{title}</h1>
          <p className="in3">
            {cat?.soon
              ? 'Esta seleção chega em breve. Enquanto isso, fale com a nossa consultora: ela consegue verificar disponibilidade.'
              : 'Toque em um perfume para ver detalhes e pedir pelo WhatsApp com a mensagem pronta.'}
          </p>
        </div>
      </section>

      <div className="filters">
        <div className="wrap filters-row">
          <div className="seg" role="group" aria-label="Gênero">
            <button aria-pressed={!genero} onClick={() => set('genero', '')}>Todos</button>
            {GENDERS.map((g) => (
              <button key={g.slug} aria-pressed={genero === g.slug} onClick={() => set('genero', g.slug)}>{g.plural}</button>
            ))}
          </div>
          <label className="sr-only" htmlFor="f-cat">Categoria</label>
          <select id="f-cat" className="field" value={categoria} onChange={(e) => set('categoria', e.target.value)}>
            <option value="">Todas as categorias</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}{c.soon ? ' (em breve)' : ''}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="f-marca">Marca</label>
          <select id="f-marca" className="field" value={marca} onChange={(e) => set('marca', e.target.value)}>
            <option value="">Todas as marcas</option>
            {allBrands.map((b) => (
              <option key={b.slug} value={b.slug}>{b.name} ({b.count})</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="f-q">Buscar</label>
          <input id="f-q" className="field grow" type="search" placeholder="Buscar perfume ou marca" defaultValue={q} key={q} onKeyDown={(e) => e.key === 'Enter' && set('q', (e.target as HTMLInputElement).value.trim())} onBlur={(e) => e.target.value.trim() !== q && set('q', e.target.value.trim())} />
          <label className="sr-only" htmlFor="f-ord">Ordenar</label>
          <select id="f-ord" className="field" value={ordem} onChange={(e) => set('ordem', e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.v} value={s.v}>{s.label}</option>
            ))}
          </select>
          <span className="count">{list.length} {list.length === 1 ? 'perfume' : 'perfumes'}</span>
        </div>
      </div>

      <section className="wrap" style={{ paddingTop: 48 }}>
        {list.length ? (
          <div className="grid4">
            {list.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2 className="serif">{cat?.soon ? 'Em breve por aqui' : 'Nenhum perfume encontrado'}</h2>
            <p style={{ color: 'var(--mute)', margin: '0 0 28px' }}>
              {cat?.soon ? 'Estamos preparando esta seleção.' : 'Tente outro nome ou limpe os filtros.'} Se preferir, a consultora procura para você.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/perfumes" className="btn btn-ink">Ver todos</Link>
              <a href={waLink(q ? `Olá! Vocês têm o perfume ${q}?` : 'Olá! Pode me ajudar a encontrar um perfume?')} className="btn btn-wa" target="_blank" rel="noopener noreferrer">Perguntar no WhatsApp</a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

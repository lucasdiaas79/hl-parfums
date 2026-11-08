import Link from 'next/link';
import type { Metadata } from 'next';
import { brands, products } from '@/lib/catalog';

export const metadata: Metadata = { title: 'Marcas', description: 'Todas as marcas de perfumes disponíveis na HL Parfums.' };

export default function MarcasPage() {
  const list = brands().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow in1" style={{ color: 'var(--gold)' }}>{list.length} marcas</span>
          <h1 className="serif in2">Compre por <em>marca</em></h1>
        </div>
      </section>
      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="grid4" style={{ gap: 18 }}>
          {list.map((b, i) => {
            const cover = products.find((p) => p.brand === b.name);
            return (
              <Link key={b.slug} href={`/perfumes?marca=${b.slug}`} className={`reveal d${i % 4}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: 14, border: '1px solid var(--line)', borderRadius: 14, background: '#fff' }}>
                {cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover.image} alt="" width={72} height={96} loading="lazy" style={{ width: 72, height: 96, objectFit: 'cover', borderRadius: 10, background: '#000' }} />
                )}
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="serif" style={{ fontSize: 26, lineHeight: 1.1 }}>{b.name}</span>
                  <span className="count">{b.count} {b.count === 1 ? 'perfume' : 'perfumes'}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

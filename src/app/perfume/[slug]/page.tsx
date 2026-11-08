import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { formatPrice, getProducts, slugify } from '@/lib/catalog';

export const revalidate = 60;
export const dynamicParams = true;
import { productMessage, waLink } from '@/lib/site';
import { IconWhats } from '@/components/Icons';
import { ProductCard } from '@/components/ProductCard';

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getProducts()).find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.name} – ${p.brand}`,
    description: p.description || `${p.name} da ${p.brand}, perfume ${p.gender.toLowerCase()} original. ${formatPrice(p.price)}. Peça pelo WhatsApp na HL Parfums.`,
    openGraph: { images: [p.image] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProducts();
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  const related = products.filter((x) => x.slug !== p.slug && (x.brand === p.brand || x.gender === p.gender)).slice(0, 4);
  const hasNotes = p.notes.top || p.notes.heart || p.notes.base;

  return (
    <>
      <div className="wrap pdp">
        <div className="pdp-media in1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={`${p.name} – ${p.brand}`} width={675} height={900} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div className="pdp-body">
          <nav className="crumbs in1" aria-label="Você está em">
            <Link href="/perfumes">Catálogo</Link> / <Link href={`/perfumes?marca=${slugify(p.brand)}`}>{p.brand}</Link>
          </nav>
          <div className="in2">
            <span className="eyebrow" style={{ color: 'var(--bronze)' }}>{p.category} · {p.gender}</span>
            <h1 className="serif">{p.name}</h1>
            <span style={{ color: 'var(--mute)' }}>{p.brand}{p.size ? ` · ${p.size}` : ''}</span>
          </div>
          <span className="in3" style={{ fontSize: 30 }}>{formatPrice(p.price)}</span>
          <p className="in3" style={{ margin: 0, color: '#3a342b', maxWidth: 540 }}>
            {p.description || `Perfume original da ${p.brand}. Quer saber notas, fixação e projeção? Nossa consultora responde na hora pelo WhatsApp.`}
          </p>
          {hasNotes && (
            <div className="notes in3">
              <div><span className="eyebrow">Topo</span><span>{p.notes.top || '—'}</span></div>
              <div><span className="eyebrow">Coração</span><span>{p.notes.heart || '—'}</span></div>
              <div><span className="eyebrow">Fundo</span><span>{p.notes.base || '—'}</span></div>
            </div>
          )}
          <div className="in4" style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 460 }}>
            <a className="btn btn-wa btn-block" href={waLink(productMessage(p.name, !p.available))} target="_blank" rel="noopener noreferrer" style={{ height: 58 }}>
              <IconWhats size={20} /> Pedir no WhatsApp
            </a>
            <span className="sheet-hint">A mensagem já vai pronta com o nome do perfume.</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <span className="eyebrow">Você também pode gostar</span>
                <h2 className="serif">Mais da <em>{p.brand}</em></h2>
              </div>
            </div>
            <div className="grid4">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

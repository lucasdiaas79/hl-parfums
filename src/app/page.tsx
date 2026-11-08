import Link from 'next/link';
import { brands, bySlug, pick, products } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';
import { Rail } from '@/components/Rail';
import { Consult } from '@/components/Consult';

const FEATURED = [
  'khamrah-lattafa',
  'yara-lattafa',
  'club-de-nuit-intense-man-armaf',
  'royal-amber-orientica-premium',
  'asad-lattafa',
  'fakhar-rose-lattafa',
  'hawas-ice-rasasi',
  'amber-oud-al-haramain',
];

export default function Home() {
  const featured = pick(FEATURED);
  const fem = products.filter((p) => p.gender === 'Feminino' && !FEATURED.includes(p.slug)).slice(0, 12);
  const masc = products.filter((p) => p.gender === 'Masculino' && !FEATURED.includes(p.slug)).slice(0, 12);
  const brandList = brands();
  const img = (s: string) => bySlug(s)?.image || '';

  const universes = [
    { label: 'Femininos', href: '/perfumes?genero=feminino', image: img('yara-lattafa') },
    { label: 'Masculinos', href: '/perfumes?genero=masculino', image: img('club-de-nuit-intense-man-armaf') },
    { label: 'Unissex', href: '/perfumes?genero=unissex', image: img('royal-amber-orientica-premium') },
    { label: 'Árabes', href: '/perfumes?categoria=arabes', image: img('khamrah-lattafa') },
    { label: 'Importados', href: '/perfumes?categoria=importados', image: '', soon: true },
    { label: 'Nicho', href: '/perfumes?categoria=nicho', image: '', soon: true },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="spot" />
        <div className="wrap hero-grid">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="eyebrow in1" style={{ display: 'block', color: 'var(--gold)' }}>
              Perfumes árabes · importados · nicho
            </span>
            <h1 className="serif in2">
              Excelência que você <em>sente</em>.
            </h1>
            <p className="hero-lead in3">
              Confiança que você percebe. Perfumes originais escolhidos um a um e atendimento pessoal do início ao fim, direto no WhatsApp.
            </p>
            <div className="in4" style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link href="/perfumes" className="btn btn-gold">Ver catálogo</Link>
              <Link href="/perfumes?categoria=arabes" className="btn btn-line">Perfumes árabes</Link>
            </div>
            <div className="pillars in4">
              <span>Originais</span>
              <span>Confiança</span>
              <span>Qualidade</span>
            </div>
          </div>
          <div className="stage in3" aria-hidden="true">
            <div className="plinth" />
            <div className="bottles parallax">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="b1" src={img('khamrah-lattafa')} alt="" width={675} height={900} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="b2" src={img('royal-amber-orientica-premium')} alt="" width={675} height={900} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="b3" src={img('asad-lattafa')} alt="" width={675} height={900} />
            </div>
          </div>
        </div>
      </section>

      {/* Universos */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="eyebrow">01 · Universos</span>
              <h2 className="serif">Escolha pelo seu <em>estilo</em></h2>
            </div>
            <Link href="/perfumes" className="link-arrow">Todos os perfumes <i /></Link>
          </div>
          <div className="arches reveal">
            {universes.map((u) => (
              <Link key={u.label} href={u.href} className={`arch${u.soon ? ' is-soon' : ''}`}>
                <span className="arch-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.soon ? '/brand/hl-mark.webp' : u.image} alt="" width={675} height={900} loading="lazy" style={u.soon ? { objectFit: 'contain', padding: '28%' } : undefined} />
                  {u.soon && <span className="arch-soon">Em breve</span>}
                </span>
                <span className="arch-label">{u.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="eyebrow">02 · Seleção HL</span>
              <h2 className="serif">Os mais <em>desejados</em></h2>
            </div>
            <Link href="/perfumes" className="link-arrow">Ver catálogo <i /></Link>
          </div>
          <div className="grid4">
            {featured.map((p, i) => (
              <div key={p.slug} className={`reveal d${i % 4}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial */}
      <section className="edit">
        <div className="wrap edit-grid">
          <div className="reveal">
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>03 · Como comprar</span>
            <h2 className="serif">
              Perfume é memória. <em>Escolha a sua.</em>
            </h2>
            <p style={{ margin: 0, color: '#b9ae9c', maxWidth: 470 }}>
              Todos os perfumes são originais e passam pela nossa curadoria antes de chegar ao catálogo. A conversa final é sempre com uma pessoa, no WhatsApp.
            </p>
          </div>
          <div className="steps reveal d1">
            <div className="step"><b>I</b><strong>Escolha</strong><span>Navegue pelo catálogo e abra o perfume que chamou sua atenção.</span></div>
            <div className="step"><b>II</b><strong>Converse</strong><span>Toque em Pedir no WhatsApp. A mensagem já vai pronta.</span></div>
            <div className="step"><b>III</b><strong>Receba</strong><span>Combine pagamento e entrega com a nossa consultora.</span></div>
          </div>
        </div>
      </section>

      <Rail eyebrow="04 · Para elas" title="Femininos" em="em destaque" href="/perfumes?genero=feminino" items={fem} />
      <Rail eyebrow="05 · Para eles" title="Masculinos" em="em destaque" href="/perfumes?genero=masculino" items={masc} />

      {/* Marcas */}
      <div className="marquee" aria-label="Marcas">
        <div className="marquee-track">
          {[...brandList, ...brandList].map((b, i) => (
            <Link key={i} href={`/perfumes?marca=${b.slug}`} tabIndex={i >= brandList.length ? -1 : 0} aria-hidden={i >= brandList.length}>
              {b.name}
            </Link>
          ))}
        </div>
      </div>

      <Consult />
    </>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap">
        <span className="eyebrow" style={{ color: 'var(--gold)' }}>Página não encontrada</span>
        <h1 className="serif">Este frasco <em>não está aqui</em>.</h1>
        <p>O perfume pode ter saído do catálogo. Veja os disponíveis ou fale com a consultora.</p>
        <div style={{ marginTop: 28 }}>
          <Link href="/perfumes" className="btn btn-gold">Ver catálogo</Link>
        </div>
      </div>
    </section>
  );
}

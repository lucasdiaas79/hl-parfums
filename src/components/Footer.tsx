import Link from 'next/link';
import { SITE, waLink } from '@/lib/site';
import { IconWhats } from './Icons';

export function Footer() {
  return (
    <>
      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-col" style={{ gap: 18 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/hl-lockup.webp" alt={SITE.name} width={679} height={675} style={{ width: 150, height: 'auto' }} loading="lazy" />
              <p style={{ margin: 0, maxWidth: 300 }}>{SITE.tagline}</p>
            </div>
            <div className="foot-col">
              <span className="eyebrow">Catálogo</span>
              <Link href="/perfumes?genero=feminino">Femininos</Link>
              <Link href="/perfumes?genero=masculino">Masculinos</Link>
              <Link href="/perfumes?genero=unissex">Unissex</Link>
              <Link href="/perfumes?categoria=arabes">Árabes</Link>
              <Link href="/marcas">Marcas</Link>
            </div>
            <div className="foot-col">
              <span className="eyebrow">Atendimento</span>
              <a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp {SITE.whatsappDisplay}</a>
              {SITE.instagram && <span>Instagram {SITE.instagram}</span>}
              {SITE.hours && <span>{SITE.hours}</span>}
              <span>Envio para todo o Brasil</span>
            </div>
            <div className="foot-col">
              <span className="eyebrow">Como comprar</span>
              <span>1. Escolha no catálogo</span>
              <span>2. Peça pelo WhatsApp</span>
              <span>3. Combine pagamento e entrega</span>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} {SITE.name} · Produtos originais</span>
            <span>Preços sujeitos a alteração. Confirme no WhatsApp.</span>
          </div>
        </div>
      </footer>
      <a className="wa-float" href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
        <IconWhats size={28} />
      </a>
    </>
  );
}

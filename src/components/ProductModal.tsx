'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/types';
import { productMessage, waLink } from '@/lib/site';
import { IconClose, IconWhats } from './Icons';

type Ctx = { open: (p: Product) => void };
const ModalCtx = createContext<Ctx>({ open: () => {} });
export const useProductModal = () => useContext(ModalCtx);

export function ProductModalProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<Product | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((p: Product) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setCurrent(p);
  }, []);
  const close = useCallback(() => {
    setCurrent(null);
    lastFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [current, close]);

  return (
    <ModalCtx.Provider value={{ open }}>
      {children}
      {current && <ProductSheet product={current} onClose={close} />}
    </ModalCtx.Provider>
  );
}

function ProductSheet({ product: p, onClose }: { product: Product; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), []);
  const hasNotes = p.notes.top || p.notes.heart || p.notes.base;

  return (
    <div className="veil" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="pm-title">
        <button ref={closeRef} className="icon-btn close" onClick={onClose} aria-label="Fechar">
          <IconClose />
        </button>
        <div className="sheet-media">
          <span className="tag">{p.category}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={`${p.name} – ${p.brand}`} width={675} height={900} />
        </div>
        <div className="sheet-body">
          <div>
            <span className="eyebrow" style={{ color: 'var(--bronze)' }}>
              {p.brand} · {p.gender}
            </span>
            <h2 id="pm-title" className="serif">{p.name}</h2>
            {p.size && <span style={{ fontSize: 14, color: 'var(--mute)' }}>{p.size}</span>}
          </div>
          <span style={{ fontSize: 26 }}>{formatPrice(p.price)}</span>
          {p.description ? (
            <p style={{ margin: 0, color: '#3a342b' }}>{p.description}</p>
          ) : (
            <p style={{ margin: 0, color: '#3a342b' }}>
              Perfume original da {p.brand}. Quer saber notas, fixação e projeção? Nossa consultora responde na hora pelo WhatsApp.
            </p>
          )}
          {hasNotes && (
            <div className="notes">
              <div><span className="eyebrow">Topo</span><span>{p.notes.top || '—'}</span></div>
              <div><span className="eyebrow">Coração</span><span>{p.notes.heart || '—'}</span></div>
              <div><span className="eyebrow">Fundo</span><span>{p.notes.base || '—'}</span></div>
            </div>
          )}
          <a className="btn btn-wa btn-block" href={waLink(productMessage(p.name, !p.available))} target="_blank" rel="noopener noreferrer" style={{ height: 58 }}>
            <IconWhats size={20} />
            {p.available ? 'Pedir no WhatsApp' : 'Avise-me pelo WhatsApp'}
          </a>
          <span className="sheet-hint">A mensagem já vai pronta com o nome do perfume.</span>
          <Link href={`/perfume/${p.slug}`} className="detail-link" onClick={onClose}>
            Ver página do perfume
          </Link>
        </div>
      </div>
    </div>
  );
}

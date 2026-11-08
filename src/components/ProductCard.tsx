'use client';

import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/types';
import { useProductModal } from './ProductModal';

export function ProductCard({ product: p, priority = false, className = '' }: { product: Product; priority?: boolean; className?: string }) {
  const { open } = useProductModal();
  return (
    <article className={`card ${className}`}>
      <button className="frame-btn" onClick={() => open(p)} aria-label={`Ver detalhes de ${p.name}`}>
        <span className={`tag${p.available ? '' : ' tag-out'}`}>{p.available ? p.gender : 'Esgotado'}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={`${p.name} – ${p.brand}`} width={675} height={900} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </button>
      <div className="card-meta">
        <span className="card-brand">{p.brand}</span>
        <h3 className="card-name">{p.name}</h3>
        <div className="card-row">
          <span className="price">{formatPrice(p.price)}</span>
          <button className="more" onClick={() => open(p)}>
            Saber mais <i />
          </button>
        </div>
      </div>
    </article>
  );
}

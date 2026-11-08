'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { IconArrow } from './Icons';

export function Rail({ eyebrow, title, em, href, items }: { eyebrow: string; title: string; em: string; href: string; items: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="serif">
              {title} <em>{em}</em>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <div className="rail-nav">
              <button aria-label="Anteriores" onClick={() => move(-1)}><IconArrow dir="left" /></button>
              <button aria-label="Próximos" onClick={() => move(1)}><IconArrow /></button>
            </div>
            <Link href={href} className="link-arrow">Ver todos <i /></Link>
          </div>
        </div>
        <div className="rail reveal" ref={ref}>
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

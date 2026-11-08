'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IconClose, IconMenu, IconSearch, IconWhats } from './Icons';
import { SITE, waLink } from '@/lib/site';

const MAIN = [
  { href: '/perfumes?genero=feminino', label: 'Femininos' },
  { href: '/perfumes?genero=masculino', label: 'Masculinos' },
  { href: '/perfumes?categoria=arabes', label: 'Árabes' },
  { href: '/marcas', label: 'Marcas' },
];
const SUB = [
  { href: '/perfumes', label: 'Todos os perfumes' },
  { href: '/perfumes?genero=feminino', label: 'Femininos' },
  { href: '/perfumes?genero=masculino', label: 'Masculinos' },
  { href: '/perfumes?genero=unissex', label: 'Unissex' },
  { href: '/perfumes?categoria=arabes', label: 'Árabes' },
  { href: '/perfumes?categoria=importados', label: 'Importados' },
  { href: '/perfumes?categoria=nicho', label: 'Nicho' },
  { href: '/marcas', label: 'Marcas' },
];

export function Header() {
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [pathname]);
  useEffect(() => {
    if (search) inputRef.current?.focus();
  }, [search]);
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
  }, [menu]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/perfumes${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
    setSearch(false);
    setMenu(false);
  };

  return (
    <>
      <div className="topbar">
        Pedidos e atendimento pelo WhatsApp<span aria-hidden="true">·</span>Envio para todo o Brasil
      </div>
      <header className="head">
        <div className="wrap head-row">
          <nav className="nav-links" aria-label="Principal">
            {MAIN.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>
          <button className="icon-btn menu-btn" aria-label="Abrir menu" onClick={() => setMenu(true)}>
            <IconMenu />
          </button>
          <Link href="/" className="brand-link" aria-label={`${SITE.name}, página inicial`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/hl-mark-sm.png" alt="" width={240} height={187} />
            <span className="brand-word">
              <b>PARFUMS</b>
              <small>Originais · Confiança · Qualidade</small>
            </span>
          </Link>
          <div className="head-tools">
            <button className="icon-btn" aria-label="Buscar" aria-expanded={search} onClick={() => setSearch((s) => !s)}>
              {search ? <IconClose /> : <IconSearch />}
            </button>
          </div>
        </div>
        {search && (
          <div className="search-panel">
            <form className="wrap" onSubmit={submit} role="search">
              <label htmlFor="q" className="sr-only">Buscar perfume ou marca</label>
              <input id="q" ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar perfume ou marca…" autoComplete="off" />
              <button className="btn btn-gold" type="submit">Buscar</button>
            </form>
          </div>
        )}
        <nav className="subnav" aria-label="Categorias">
          {SUB.map((l) => (
            <Link key={l.label} href={l.href}>{l.label}</Link>
          ))}
        </nav>
      </header>

      {menu && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/hl-mark-sm.png" alt={SITE.name} width={72} height={56} style={{ height: 48, width: 'auto' }} />
            <button className="icon-btn" aria-label="Fechar menu" onClick={() => setMenu(false)}>
              <IconClose size={22} />
            </button>
          </div>
          <form onSubmit={submit} role="search" style={{ display: 'flex', gap: 10 }}>
            <label htmlFor="qm" className="sr-only">Buscar perfume ou marca</label>
            <input id="qm" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar perfume ou marca" className="field" style={{ flex: 1, height: 48, background: 'transparent', color: 'var(--ivory)', borderColor: 'rgba(245,241,234,.3)' }} />
            <button className="icon-btn" type="submit" aria-label="Buscar" style={{ border: '1px solid rgba(245,241,234,.3)', width: 48, height: 48 }}>
              <IconSearch />
            </button>
          </form>
          <nav aria-label="Menu principal">
            {SUB.map((l) => (
              <Link key={l.label} href={l.href} onClick={() => setMenu(false)}>{l.label}</Link>
            ))}
          </nav>
          <a className="btn btn-wa" href={waLink()} target="_blank" rel="noopener noreferrer">
            <IconWhats size={20} /> Falar no WhatsApp
          </a>
        </div>
      )}
    </>
  );
}

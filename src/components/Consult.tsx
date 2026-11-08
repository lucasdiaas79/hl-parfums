'use client';

import { useState } from 'react';
import { waLink } from '@/lib/site';
import { IconWhats } from './Icons';

const FOR = ['Para mim', 'Para presentear'];
const WHO = ['Feminino', 'Masculino', 'Tanto faz'];
const STYLE = ['Doce', 'Amadeirado', 'Fresco', 'Intenso', 'Floral'];

export function Consult() {
  const [f, setF] = useState(FOR[0]);
  const [w, setW] = useState(WHO[2]);
  const [s, setS] = useState<string[]>([]);
  const toggle = (v: string) => setS((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  const msg =
    `Olá! Estou procurando um perfume ${f === 'Para mim' ? 'para mim' : 'para presentear'}` +
    `${w !== 'Tanto faz' ? `, ${w.toLowerCase()}` : ''}` +
    `${s.length ? `, com estilo ${s.join(', ').toLowerCase()}` : ''}. Pode me indicar algumas opções?`;

  const Group = ({ label, items, value, onPick, multi = false }: { label: string; items: string[]; value: string | string[]; onPick: (v: string) => void; multi?: boolean }) => (
    <div>
      <p className="consult-label">{label}</p>
      <div className="chips">
        {items.map((it) => {
          const on = multi ? (value as string[]).includes(it) : value === it;
          return (
            <button key={it} className="chip" aria-pressed={on} onClick={() => onPick(it)}>{it}</button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="sec">
      <div className="wrap">
        <div className="consult reveal">
          <div>
            <span className="eyebrow" style={{ color: 'var(--bronze)' }}>Consultoria HL</span>
            <h2 className="serif">Não sabe qual escolher? <em>A gente indica.</em></h2>
            <p style={{ margin: 0, color: 'var(--mute)' }}>
              Conte o que você procura e envie para a nossa consultora. Ela responde com sugestões do catálogo que combinam com você.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Group label="É para" items={FOR} value={f} onPick={setF} />
            <Group label="Perfil" items={WHO} value={w} onPick={setW} />
            <Group label="Estilo (pode marcar mais de um)" items={STYLE} value={s} onPick={toggle} multi />
            <a className="btn btn-ink" href={waLink(msg)} target="_blank" rel="noopener noreferrer" style={{ alignSelf: 'flex-start' }}>
              <IconWhats size={18} color="#E2C688" /> Pedir indicação
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

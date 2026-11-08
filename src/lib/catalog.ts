import raw from '@/data/catalogo.json';

export type Gender = 'Feminino' | 'Masculino' | 'Unissex';

export type Product = {
  ref: string;
  slug: string;
  name: string;
  brand: string;
  gender: Gender;
  category: string;
  price: number | null;
  size: string;
  image: string;
  description: string;
  notes: { top: string; heart: string; base: string };
  available: boolean;
};

type RawItem = {
  ref: string;
  slug: string;
  nome: string;
  marca: string;
  genero: string;
  categoria: string;
  preco: number | null;
  tamanho?: string;
  foto: string;
  descricao?: string;
  notas?: { topo?: string; coracao?: string; fundo?: string };
  status?: string;
};

export const products: Product[] = (raw as RawItem[])
  .filter((r) => r.preco !== null)
  .map((r) => ({
    ref: r.ref,
    slug: r.slug,
    name: r.nome,
    brand: r.marca,
    gender: r.genero as Gender,
    category: r.categoria,
    price: r.preco,
    size: r.tamanho || '',
    image: '/' + r.foto,
    description: r.descricao || '',
    notes: { top: r.notas?.topo || '', heart: r.notas?.coracao || '', base: r.notas?.fundo || '' },
    available: true,
  }));

export const CATEGORIES = [
  { slug: 'arabes', label: 'Árabes', soon: false },
  { slug: 'importados', label: 'Importados', soon: true },
  { slug: 'nicho', label: 'Nicho', soon: true },
] as const;

export const GENDERS: { slug: string; label: Gender; plural: string }[] = [
  { slug: 'feminino', label: 'Feminino', plural: 'Femininos' },
  { slug: 'masculino', label: 'Masculino', plural: 'Masculinos' },
  { slug: 'unissex', label: 'Unissex', plural: 'Unissex' },
];

export function brands() {
  const map = new Map<string, number>();
  for (const p of products) map.set(p.brand, (map.get(p.brand) || 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count, slug: slugify(name) }));
}

export function bySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function pick(slugs: string[]) {
  return slugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean) as Product[];
}

export function slugify(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatPrice(v: number | null) {
  if (v === null) return 'Consulte';
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

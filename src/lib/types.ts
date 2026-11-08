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
  featured: boolean;
};

export type Brand = { name: string; count: number; slug: string };

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

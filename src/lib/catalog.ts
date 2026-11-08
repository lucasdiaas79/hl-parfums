import 'server-only';
import raw from '@/data/catalogo.json';
import type { Product, Gender } from './types';
export type { Product, Gender } from './types';
export { formatPrice, slugify, CATEGORIES, GENDERS } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hqszfftdntquueizyats.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_eRi1QPhe1uu70iRQdzlrkg_6-b_5Zyl';

function imageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Fotos do catálogo inicial ficam no próprio site; uploads do painel ficam no Storage (têm pasta no caminho).
  if (!path.includes('/')) return `/fotos/${path}`;
  return `${SUPABASE_URL}/storage/v1/object/public/fotos/${path}`;
}

type Row = {
  ref: string | null;
  slug: string;
  name: string;
  gender: Gender;
  price: number | null;
  size: string;
  description: string;
  notes_top: string;
  notes_heart: string;
  notes_base: string;
  status: 'active' | 'sold_out' | 'hidden';
  featured: boolean;
  brands: { name: string } | null;
  categories: { name: string } | null;
  product_images: { path: string; position: number }[];
};

async function fromSupabase(): Promise<Product[] | null> {
  try {
    const q =
      'select=ref,slug,name,gender,price,size,description,notes_top,notes_heart,notes_base,status,featured,brands(name),categories(name),product_images(path,position)' +
      '&status=neq.hidden&order=position.asc';
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?${q}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      next: { revalidate: 60, tags: ['catalog'] },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as Row[];
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return rows.map((r) => {
      const img = [...(r.product_images || [])].sort((a, b) => a.position - b.position)[0];
      return {
        ref: r.ref || '',
        slug: r.slug,
        name: r.name,
        brand: r.brands?.name || '',
        gender: r.gender,
        category: r.categories?.name || '',
        price: r.price === null ? null : Number(r.price),
        size: r.size || '',
        image: imageUrl(img?.path || ''),
        description: r.description || '',
        notes: { top: r.notes_top || '', heart: r.notes_heart || '', base: r.notes_base || '' },
        available: r.status === 'active',
        featured: !!r.featured,
      };
    });
  } catch {
    return null;
  }
}

type RawItem = {
  ref: string; slug: string; nome: string; marca: string; genero: string; categoria: string;
  preco: number | null; tamanho?: string; foto: string; descricao?: string;
};

const FEATURED_FALLBACK = ['khamrah-lattafa', 'yara-lattafa', 'club-de-nuit-intense-man-armaf', 'royal-amber-orientica-premium', 'asad-lattafa', 'fakhar-rose-lattafa', 'hawas-ice-rasasi', 'amber-oud-al-haramain'];

function fromFile(): Product[] {
  return (raw as RawItem[])
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
      notes: { top: '', heart: '', base: '' },
      available: true,
      featured: FEATURED_FALLBACK.includes(r.slug),
    }));
}

// Lê do banco (Supabase); se ele estiver fora do ar, usa a cópia local do catálogo.
export async function getProducts(): Promise<Product[]> {
  return (await fromSupabase()) ?? fromFile();
}

export function brandsOf(products: Product[]) {
  const map = new Map<string, number>();
  for (const p of products) map.set(p.brand, (map.get(p.brand) || 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count, slug: slugifyLocal(name) }));
}

function slugifyLocal(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

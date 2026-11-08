import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CatalogBrowser } from '@/components/CatalogBrowser';
import { brandsOf, getProducts } from '@/lib/catalog';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Catálogo de perfumes',
  description: 'Perfumes originais árabes, importados e de nicho, femininos, masculinos e unissex. Peça pelo WhatsApp.',
};

export default async function PerfumesPage() {
  const products = await getProducts();
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <CatalogBrowser products={products} brands={brandsOf(products)} />
    </Suspense>
  );
}

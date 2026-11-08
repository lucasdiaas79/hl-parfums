import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CatalogBrowser } from '@/components/CatalogBrowser';

export const metadata: Metadata = {
  title: 'Catálogo de perfumes',
  description: 'Perfumes originais árabes, importados e de nicho, femininos, masculinos e unissex. Peça pelo WhatsApp.',
};

export default function PerfumesPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <CatalogBrowser />
    </Suspense>
  );
}

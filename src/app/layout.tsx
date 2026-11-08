import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductModalProvider } from '@/components/ProductModal';
import { RevealObserver } from '@/components/Reveal';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'HL Parfums — Perfumes árabes, importados e de nicho', template: '%s · HL Parfums' },
  description: 'Perfumes originais árabes, importados e de nicho. Escolha no catálogo e finalize com a nossa consultora pelo WhatsApp. Envio para todo o Brasil.',
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
  openGraph: {
    title: 'HL Parfums',
    description: SITE.tagline,
    images: ['/brand/hl-lockup.webp'],
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#000000' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap"
        />
      </head>
      <body>
        <ProductModalProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ProductModalProvider>
        <RevealObserver />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: '메리메모 · 편지 한 장마다 트리에 장식이 하나씩', template: '%s · 메리메모' },
  description: '친구들이 편지를 쓸 때마다 내 트리에 장식이 하나씩 걸려요. 12월 25일 0시에 장식을 뒤집어 편지를 읽어 봐요.',
  manifest: '/manifest.webmanifest',
  icons: { icon: [{ url: '/icons/favicon-48.png', sizes: '48x48' }, { url: '/icons/icon-192.png', sizes: '192x192' }], apple: '/icons/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: '메리메모', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
  openGraph: { type: 'website', siteName: '메리메모', locale: 'ko_KR', images: [{ url: '/og/classic.png', width: 1200, height: 600 }] },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#5A1220',
};

const ADSENSE = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        {ADSENSE && (
          <Script async strategy="afterInteractive" crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}`} />
        )}
      </body>
    </html>
  );
}

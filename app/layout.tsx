import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header, Footer, StickyBar, JsonLd } from '../components/Common';
import Motion from '../components/Motion';
import { businessJsonLd, ogImages } from '../lib/jsonld';
import { SITE_URL, BRAND } from '../lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND} | 암막커튼·맞춤커튼·블라인드 실측 설치`, template: '%s' },
  description: '커튼·블라인드 실측·제작·설치. 쉬폰·일반·암막 원단 비교, 콤비·우드·버티컬블라인드, 전동커튼.',
  robots: { index: true, follow: true },
  alternates: { types: { 'application/rss+xml': `${SITE_URL}/rss.xml` } },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', images: ogImages('home', BRAND) },
  twitter: { card: 'summary_large_image', images: ogImages('home', BRAND) },
};
export const viewport: Viewport = { themeColor: '#1d1a1f', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700&display=swap" /><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" /></head>
      <body>
        <JsonLd data={businessJsonLd()} />
        <Header />
        {children}
        <Footer />
        <StickyBar />
        <Motion />
      </body>
    </html>
  );
}

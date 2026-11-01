import type { Metadata } from 'next';
import Link from 'next/link';
import { OPEN_PAGES, pagePath } from '../../lib/data';
import { BRAND } from '../../lib/site';
import { itemListJsonLd, ogImages } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

const TITLE = `지역별 커튼·블라인드 안내 | ${BRAND}`;
const DESC = '대전·세종·충청·경기 지역별 암막커튼·맞춤커튼·블라인드 안내 모음입니다. 동네마다 창 방향과 채광, 맞춤 제작·실측·설치 방법을 정리했고 전화 한 통으로 방문 실측 일정을 잡을 수 있습니다.';
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: '/area/' },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title: TITLE, description: DESC, url: '/area/', images: ogImages('area', '지역별 커튼·블라인드 안내') },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ogImages('area', '지역별 커튼·블라인드 안내') },
};

export default function AreaIndex() {
  const pages = OPEN_PAGES.filter((p) => !p.variantOf);
  const cities = Array.from(new Set(pages.map((p) => p.city)));
  return (
    <main><JsonLd data={itemListJsonLd(pages)} /><div className="wrap content page-top">
      <h1 className="page-title">지역별 커튼·블라인드 안내</h1>
      <p className="prose-p">동네마다 창 방향과 채광, 맞춤 제작·실측·설치 방법을 정리했습니다. 지역 이름을 누르면 해당 안내로 이동합니다.</p>
      {cities.map((c) => (
        <section key={c} className="area-block" data-reveal>
          <h2 className="area-h">{c}</h2>
          <ul className="area-list">{pages.filter((p) => p.city === c).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}</Link></li>)}</ul>
        </section>
      ))}
    </div></main>
  );
}

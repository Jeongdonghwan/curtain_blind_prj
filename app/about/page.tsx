// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). site.ts 와 페이지 데이터에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { OPEN_PAGES } from '../../lib/data';
import { BRAND, BUSINESS, CONTACT, LINKS, UPDATED, tel, smsHref } from '../../lib/site';
import { breadcrumbJsonLd, ogImages } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

const TITLE = `소개 | ${BRAND}`;
const DESC = '커튼·블라인드를 실측하고 제작·설치하는 곳입니다. 하는 일, 다니는 지역, 연락 방법, 사업자 정보를 사실대로 정리했습니다.';
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: '/about/' },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title: TITLE, description: DESC, url: '/about/', images: ogImages('home', BRAND) },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ogImages('home', BRAND) },
};

// 업체 구조화 데이터(HomeAndConstructionBusiness)는 layout 에서 전 페이지에 들어간다
export default function About() {
  const cities = Array.from(new Set(OPEN_PAGES.filter((p) => !p.variantOf).map((p) => p.city)));
  return (
    <main><JsonLd data={breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])} /><div className="wrap content page-top">
      <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span>소개</nav>
      <h1 className="page-title">{BRAND} 소개</h1>
      <p className="prose-p">{BRAND}는 커튼·블라인드를 실측하고 제작·설치합니다.</p>
      <section className="area-block">
        <h2 className="area-h">하는 일</h2>
        <p className="prose-p">커튼, 콤비롤스크린, 항균블라인드, 롤스크린, 버티칼, 트리플쉐이드, 우드, 알루미늄, 허니콤쉐이드, 홀딩도어를 다룹니다. 창 크기를 재고, 원단과 종류를 정한 뒤 제작해 설치합니다.</p>
      </section>
      <section className="area-block">
        <h2 className="area-h">다니는 지역</h2>
        <p className="prose-p">{cities.join(', ')} 지역을 다닙니다. 동네별 안내는 <Link href="/area/">지역별 안내</Link>에, 원단·실측 글은 <Link href="/blog/">블로그</Link>에 있습니다.</p>
      </section>
      <section className="area-block">
        <h2 className="area-h">연락 방법</h2>
        <p className="prose-p">전화 <a href={tel}>{CONTACT.phone}</a>, 문자 <a href={smsHref}>{CONTACT.sms}</a>로 받습니다.{CONTACT.hours && ` 상담 시간은 ${CONTACT.hours}입니다.`}</p>
      </section>
      <section className="area-block">
        <h2 className="area-h">사업자 정보</h2>
        <p className="prose-p">
          {BUSINESS.name && `상호는 ${BUSINESS.name}입니다. `}
          {BUSINESS.ceo && `대표는 ${BUSINESS.ceo}입니다. `}
          {BUSINESS.bizNumber && `사업자등록번호는 ${BUSINESS.bizNumber}입니다. `}
          {BUSINESS.address && `주소는 ${BUSINESS.address}입니다.`}
        </p>
        {LINKS.length > 0 && <p className="prose-p">제품은 {LINKS.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener">{l.label} 홈페이지</a>)}에서 볼 수 있습니다.</p>}
        <p className="prose-p">이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
      </section>
    </div></main>
  );
}

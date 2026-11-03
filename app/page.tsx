import type { Metadata } from 'next';
import Link from 'next/link';
import { cityHubs, pagePath } from '../lib/data';
import { getPosts, postPath } from '../lib/blog';
import { CONTACT } from '../lib/site';
import { faqJsonLd, itemListJsonLd } from '../lib/jsonld';
import { CATEGORIES, CAT_COVER, PHOTOS, photo, shortName } from '../lib/photos';
import { Actions, FixedLinks, IconArrow, JsonLd, LightScale, SectionHead, Trio } from '../components/Common';

export const metadata: Metadata = { alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } } };

// 홈페이지(design8282.com) 무료 방문견적 신청서 기준 절차
const STEPS = [
  { t: '방문견적 신청', d: '전화·문자로 주소와 원하는 날짜, 설치할 방을 알려주세요.' },
  { t: '일정 조정', d: '상담팀이 연락해 정확한 날짜와 시간을 맞춥니다.' },
  { t: '실측·제품 선택', d: '창 가로·세로를 재고 제품과 원단 색을 고릅니다.' },
  { t: '제작', d: '잰 치수(cm)대로 제작합니다.' },
  { t: '설치·점검', d: '벽 재질에 맞는 피스로 고정하고 여닫아 봅니다.' },
];
// 제품 상세 페이지의 주문 옵션
const ORDER = [
  ['주문 크기', '가로 × 세로 (cm)'],
  ['손잡이 방향', '좌측 · 우측'],
  ['고정 피스', '철제 · 목공용 · 석고용 · 콘크리트'],
  ['받는 방법', '택배발송 · 설치요망 · 상담후결정'],
  ['홀딩도어', '편계 · 양계 · 중계 (원단이 모이는 쪽)'],
];
const PLACES = ['거실', '안방·침실', '아이 방·작은 방', '서재', '베란다', '사무실', '상업공간'];
const FAQ = [
  { q: '방문 견적은 무료인가요?', a: '디자인그리다 홈페이지에서 무료 방문견적 신청을 받습니다. 전화나 문자로 주소와 희망 날짜를 알려주시면 일정을 잡습니다.' },
  { q: '상담은 몇 시까지 되나요?', a: `홈페이지 기준 근무시간은 아침 7시부터 저녁 9시까지, 365일 연중무휴입니다. 전화 ${CONTACT.phone}.` },
  { q: '어떤 제품을 다루나요?', a: '커튼(암막·무지·디자인), 콤비롤스크린, 항균블라인드, 롤스크린·버티칼, 트리플쉐이드, 우드·알루미늄 블라인드, 허니콤쉐이드, 홀딩도어입니다.' },
  { q: '암막이면 완전히 깜깜해지나요?', a: '원단은 빛을 대부분 막지만, 위·옆 틈으로 빛이 샐 수 있습니다. 레일을 창보다 넓게 다는 이유입니다.' },
  { q: '직접 달 수도 있나요?', a: '홈페이지 주문 옵션에 택배발송·설치요망·상담후결정이 있습니다. 벽 재질에 맞는 피스(철제·목공용·석고용·콘크리트)를 골라 받습니다.' },
];
const RAIL = PHOTOS.filter((p) => p.shape === 'wide');
const HERO = ['/img/curtain-hj-darkgrey.jpg', '/img/sq-combi-woodlook.jpg', '/img/sq-wood-plus-920.jpg'].map(photo);

export default function Home() {
  const hubs = cityHubs();
  const posts = getPosts().slice(0, 4);
  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), itemListJsonLd(hubs.flatMap((h) => h.pages).slice(0, 30))]} />
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 className="hero-title"><span>창 크기대로,</span><span>빛은 원하는 만큼</span></h1>
            <p className="hero-lead">커튼부터 콤비·우드·알루미늄 블라인드, 롤스크린·버티칼, 허니콤·트리플쉐이드, 홀딩도어까지. 무료 방문견적으로 창을 재고 맞춰 답니다.</p>
            <Actions />
            <dl className="hero-specs">
              <div><dt>매장</dt><dd>공장직영 디자인그리다</dd></div>
              <div><dt>방문 견적</dt><dd>무료 신청</dd></div>
              <div><dt>상담 시간</dt><dd>07–21시 · 연중무휴</dd></div>
            </dl>
          </div>
          <Trio eager pics={HERO.map((p, i) => ({ file: p.file, w: p.w, h: p.h, alt: `디자인그리다 ${p.cat} ${shortName(p)} 제품 사진${i === 0 ? ' — 암막커튼' : ''}`, cap: `${shortName(p)} · ${p.cat}` }))} />
        </div>
        <p className="wrap hero-credit">사진 · 디자인그리다 홈페이지 제품 사진</p>
      </section>
      <FixedLinks />

      <div className="wrap content">
        <section className="sec" id="products">
          <SectionHead title="취급 제품" sub="디자인그리다 홈페이지의 제품 분류 그대로입니다. 사진을 누르면 홈페이지 해당 분류로 갑니다." />
          <div className="cat-index">
            {CATEGORIES.slice(0, 1).map((c) => {
              const p = photo(CAT_COVER[c.cat]);
              return (
                <a key={c.cat} href={c.url} target="_blank" rel="noopener" className="cat-feature" data-reveal>
                  <span className="cat-ph mask"><img src={p.file} alt={`디자인그리다 ${c.cat} — ${shortName(p)} 제품 사진`} width={p.w} height={p.h} loading="lazy" /></span>
                  <span className="cat-txt"><b>{c.cat}</b><small>{c.sub.slice(0, 4).join(' · ')}</small></span>
                </a>
              );
            })}
            <ul className="cat-rows reveal-group">
              {CATEGORIES.slice(1).map((c) => {
                const p = photo(CAT_COVER[c.cat]);
                return (
                  <li key={c.cat}><a href={c.url} target="_blank" rel="noopener">
                    <img src={p.file} alt={`디자인그리다 ${c.cat} — ${shortName(p)} 제품 사진`} width={p.w} height={p.h} loading="lazy" />
                    <span className="cat-txt"><b>{c.cat}</b><small>{c.sub.slice(0, 4).join(' · ')}</small></span>
                    <IconArrow />
                  </a></li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      <section className="dark-band" id="gallery">
        <div className="wrap">
          <SectionHead title="제품 사진" sub="홈페이지에 올라온 제품 사진입니다. 같은 원단도 창 크기와 빛에 따라 달라 보여, 실측 때 샘플로 다시 확인합니다." />
          <div className="rail-nav"><button type="button" data-scroll="-1" data-target="ph-rail" aria-label="이전 사진">‹</button><button type="button" data-scroll="1" data-target="ph-rail" aria-label="다음 사진">›</button></div>
          <div className="ph-rail" id="ph-rail">
            {RAIL.map((p) => (
              <figure key={p.file}>
                <div className="ph"><img src={p.file} alt={`디자인그리다 ${p.cat} ${shortName(p)} 제품 사진`} width={p.w} height={p.h} loading="lazy" /></div>
                <figcaption><b>{shortName(p)}</b><span>{p.cat}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap content">
        <section className="sec stone" id="light">
          <SectionHead title="빛 막는 정도 비교" sub="원단이 두꺼울수록 빛을 막고, 방은 그만큼 어두워집니다." />
          <LightScale on={['sheer', 'normal', 'black']} />
        </section>
        <section className="sec" id="order">
          <SectionHead title="주문할 때 정하는 것" sub="홈페이지 제품 주문서에 있는 항목입니다. 방문 실측 때 함께 정합니다." />
          <div className="cols">
            <dl className="info" data-reveal>{ORDER.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <div data-reveal>
              <h3 className="mini-h">방문견적 신청 때 고르는 설치 장소</h3>
              <ul className="place-list">{PLACES.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className="note">특정 시간만 가능하면 예약 날짜가 늦춰질 수 있습니다. 오전·오후·언제든지 중에서 고르면 일정이 빨리 잡힙니다.</p>
            </div>
          </div>
        </section>
        <section className="sec stone" id="process">
          <SectionHead title="신청부터 설치까지" />
          <ol className="timeline reveal-group">{STEPS.map((st) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p></li>)}</ol>
        </section>
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-band-in"><p>창 사진과 <em>대략적인 크기</em>만 보내주세요.</p><Actions dark /></div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead title="지역별 안내" sub={hubs.map((h) => h.sido).join(' · ')} />
          <div className="regions">
            {hubs.map((h) => (
              <div key={h.sido} className="region-col" data-reveal>
                <h3>{h.sido}</h3>
                <ul>{h.pages.map((p) => <li key={p.slug}><Link href={pagePath(p)}><span>{p.region}</span><IconArrow /></Link></li>)}</ul>
              </div>
            ))}
          </div>
          <p data-reveal><Link href="/area/" className="more">전체 지역 페이지 <IconArrow /></Link></p>
        </section>
        {posts.length > 0 && (
          <section className="sec" id="blog">
            <SectionHead title="고르기 전에 읽어 볼 글" sub="원단, 길이, 레일, 블라인드 방식처럼 실측 전에 자주 받는 질문에 한 편씩 답합니다." />
            <ul className="post-list home-posts reveal-group">
              {posts.map((p) => (
                <li key={p.slug}><Link href={postPath(p)}><time dateTime={p.publishedAt}>{p.publishedAt.replace(/-/g, '.')}</time><strong>{p.title}</strong><span>{p.description}</span></Link></li>
              ))}
            </ul>
            <p data-reveal><Link href="/blog/" className="more">글 전체 보기 <IconArrow /></Link></p>
          </section>
        )}
        <section className="sec stone faq-ed">
          <SectionHead title="자주 묻는 질문" sub="방문견적·주문 전에 확인할 내용입니다." />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>무료 방문견적부터</h2>
          <p>주소와 원하는 날짜를 알려주시면 실측 일정을 잡습니다. 창 사진을 먼저 보내주셔도 됩니다.</p>
          <Actions dark />
          <FixedLinks compact />
        </div>
      </section>
    </main>
  );
}

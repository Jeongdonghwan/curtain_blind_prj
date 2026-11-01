// 커튼·블라인드 공통 UI — 각진 버튼, 선 아이콘, 왼쪽 정렬 세리프 섹션 머리(위 가는 선), 빛 막는 정도 비교, 고정 링크 띠.
import Link from 'next/link';
import { BRAND, BRAND_EN, CONTACT, BUSINESS, LINKS, tel, smsHref } from '../lib/site';
import { LIGHT } from '../lib/compose';

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}</>
);
const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = () => <Svg d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconMsg = () => <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IconArrow = () => <Svg d="M5 12h14M13 6l6 6-6 6" size={16} />;
export const IconExt = () => <Svg d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" size={15} />;

export const Actions = ({ dark }: { dark?: boolean }) => (
  <div className={`actions ${dark ? 'on-dark' : ''}`}>
    <a className="btn-primary" href={tel}><IconPhone /><span>{CONTACT.phone}</span></a>
    <a className="btn-text" href={smsHref}><IconMsg /><span>문자 상담 {CONTACT.sms}</span><IconArrow /></a>
    {CONTACT.kakao && <a className="btn-text" href={CONTACT.kakao} target="_blank" rel="noopener"><span>카카오톡</span><IconArrow /></a>}
  </div>
);

const inner = (
  <>
    <span className="official-label">바로가기</span>
    {LINKS.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener"><b>{l.label}</b><span>{l.sub}</span><IconExt /></a>)}
  </>
);
export const FixedLinks = ({ compact }: { compact?: boolean }) =>
  LINKS.length ? (
    compact ? <div className="official compact">{inner}</div>
      : <div className="official-band"><div className="wrap official">{inner}</div></div>
  ) : null;

export const SectionHead = ({ title, sub }: { title: React.ReactNode; sub?: string }) => (
  <header className="sh" data-reveal><h2>{title}</h2>{sub && <p>{sub}</p>}</header>
);

// 빛 막는 정도 — 창(밝은 면) 위로 원단이 내려오며 가리는 정도를 실제 순서대로 그린다
export const LightScale = ({ on = [] as string[], text = {} as Record<string, string> }) => (
  <div className="light reveal-group">
    {LIGHT.map((m) => (
      <figure key={m.key} className={on.includes(m.key) ? 'on' : ''}>
        <div className="light-win" style={{ ['--shade' as any]: m.shade }} aria-hidden="true"><i /></div>
        <figcaption><strong>{m.name}</strong><span>{text[m.key] || m.d}</span></figcaption>
      </figure>
    ))}
    <p className="light-axis"><span>빛 잘 들어옴</span><span>빛 대부분 막음</span></p>
  </div>
);

// 사진 묶음 — 큰 사진 1장 + 작은 사진 2장 (디자인그리다 홈페이지 제품 사진)
type Pic = { file: string; w: number; h: number; alt: string; cap: string };
export const Trio = ({ pics, eager }: { pics: Pic[]; eager?: boolean }) => (
  <div className="trio">
    {pics.slice(0, 3).map((x, i) => (
      <figure key={x.file} className={i === 0 ? 'mask' : ''} data-reveal>
        <img src={x.file} alt={x.alt} width={x.w} height={x.h} loading={eager ? undefined : 'lazy'} />
        <figcaption>{x.cap}</figcaption>
      </figure>
    ))}
  </div>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="logo"><b>{BRAND}</b><small>{BRAND_EN}</small></Link>
      <nav className="nav">
        <Link href="/#products">제품</Link>
        <Link href="/#light">원단·방식</Link>
        <Link href="/area/">지역</Link>
        <a href={tel} className="nav-call"><IconPhone />{CONTACT.phone}</a>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div>
        <strong className="foot-brand">{BRAND}</strong>
        <p>공장직영 커튼·블라인드. 커튼·콤비롤스크린·항균블라인드·롤스크린·버티칼·트리플쉐이드·우드·알루미늄·허니콤쉐이드·홀딩도어.</p>
        {LINKS.length > 0 && <p className="foot-links">{LINKS.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener">{l.label}</a>)}</p>}
      </div>
      <ul className="foot-info">
        <li><span>대표전화</span>{CONTACT.phone}</li>
        <li><span>문자</span>{CONTACT.sms}</li>
        {CONTACT.hours && <li><span>상담 시간</span>{CONTACT.hours}</li>}
        {BUSINESS.name && <li><span>상호</span>{BUSINESS.name}</li>}
        {BUSINESS.ceo && <li><span>대표</span>{BUSINESS.ceo}</li>}
        {BUSINESS.bizNumber && <li><span>사업자</span>{BUSINESS.bizNumber}</li>}
        {BUSINESS.address && <li><span>주소</span>{BUSINESS.address}</li>}
      </ul>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {BRAND}</div>
  </footer>
);

export const StickyBar = () => (
  <div className="sticky-bar">
    <a href={tel} className="sb-call"><IconPhone />전화 상담</a>
    <a href={smsHref} className="sb-sms"><IconMsg />문자</a>
  </div>
);

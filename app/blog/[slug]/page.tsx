import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts, getPost, postPath, postEncodedPath } from '../../../lib/blog';
import { articleJsonLd, breadcrumbJsonLd, ogImages } from '../../../lib/jsonld';
import { photosFor, shortName } from '../../../lib/photos';
import { Actions, FixedLinks, IconArrow, JsonLd } from '../../../components/Common';
import { BRAND, SITE_URL } from '../../../lib/site';

export const dynamicParams = false;

// 글이 0편이면 Next 14 정적 export 가 빈 목록을 거부하므로 자리표시 1개(/blog/404/ = 404 화면)
const NONE = '404';
export function generateStaticParams() {
  const posts = getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: NONE }];
}

// og 키 = scripts/make_og.py 의 blog-<slug>. 사진도 같은 규칙(photosFor(industry, 'blog-<slug>').hero)
const ogKey = (slug: string) => `blog-${slug}`;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPost(params.slug);
  if (!p) return { robots: { index: false, follow: true } };
  const title = `${p.title} | ${BRAND}`.length <= 60 ? `${p.title} | ${BRAND}` : p.title;
  const url = postEncodedPath(p);
  const images = ogImages(ogKey(p.slug), p.title);
  return {
    title, description: p.description, alternates: { canonical: url },
    openGraph: { type: 'article', publishedTime: p.publishedAt, siteName: BRAND, locale: 'ko_KR', title, description: p.description, url, images },
    twitter: { card: 'summary_large_image', title, description: p.description, images },
  };
}

// 본문 한 줄: [글자](/경로/) 만 링크로. 아직 공개 전(예약)인 글로 가는 링크는 글자만 남긴다
const Inline = ({ text }: { text: string }) => (
  <>
    {text.split(/(\[[^\]]+\]\([^)]+\))/).map((part, i) => {
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (!m) return part;
      const blog = m[2].match(/^\/blog\/([^/]+)\/?$/);
      return blog && !getPost(blog[1]) ? m[1] : <Link key={i} href={m[2]}>{m[1]}</Link>;
    })}
  </>
);

export default function BlogPost({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) notFound();
  const path = postEncodedPath(p);
  const others = getPosts().filter((x) => x.slug !== p.slug).slice(0, 6);
  const hero = photosFor(p.word, ogKey(p.slug)).hero;
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '블로그', path: '/blog/' }, { name: p.title, path }]),
        articleJsonLd({ title: p.title, description: p.description, path, image: `${SITE_URL}/og/${encodeURIComponent(ogKey(p.slug))}.jpg`, date: p.publishedAt }),
      ]} />
      <section className="hero hero-kw">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/blog/">블로그</Link></nav>
            <h1 className="hero-title"><span>{p.title}</span></h1>
            <p className="hero-lead">{p.description}</p>
            <p className="post-date"><time dateTime={p.publishedAt}>{p.publishedAt.replace(/-/g, '.')}</time></p>
          </div>
          <figure className="hero-photo mask" data-reveal>
            <img src={hero.file} alt={`${p.keyword} 참고 — 디자인그리다 ${hero.cat} ${shortName(hero)} 제품 사진`} width={hero.w} height={hero.h} />
            <figcaption>사진 · 디자인그리다 제품 ({shortName(hero)})</figcaption>
          </figure>
        </div>
      </section>

      <div className="wrap content">
        <article className="post">
          {p.sections.map((s, i) => (
            <section key={i} className="post-sec">
              <h2>{s.h}</h2>
              {s.blocks.map((b, j) =>
                'p' in b
                  ? <p key={j} className={i === 0 && j === 0 ? 'first' : ''}><Inline text={b.p} /></p>
                  : <ul key={j} className="post-ul">{b.list.map((li, k) => <li key={k}><Inline text={li} /></li>)}</ul>
              )}
            </section>
          ))}
        </article>

        <section className="sec related">
          <div>
            <h2 className="rel-h">다른 글</h2>
            <ul>{others.map((x) => <li key={x.slug}><Link href={postPath(x)}><span>{x.title}</span><IconArrow /></Link></li>)}</ul>
          </div>
          <div>
            <h2 className="rel-h">더 보기</h2>
            <ul>
              <li><Link href="/blog/"><span>전체 글 목록</span><IconArrow /></Link></li>
              <li><Link href="/area/"><span>지역별 커튼·블라인드 안내</span><IconArrow /></Link></li>
              <li><Link href="/"><span>취급 제품과 방문견적 절차</span><IconArrow /></Link></li>
            </ul>
          </div>
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>창 사진부터 보내주세요</h2>
          <p>창 전체와 천장이 보이게 찍은 사진, 대략적인 가로·세로를 문자로 보내주시면 맞는 방식을 먼저 안내합니다.</p>
          <Actions dark />
          <FixedLinks compact />
        </div>
      </section>
    </main>
  );
}

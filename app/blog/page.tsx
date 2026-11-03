import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, postPath, postEncodedPath } from '../../lib/blog';
import { breadcrumbJsonLd, ogImages, pathListJsonLd } from '../../lib/jsonld';
import { Actions, JsonLd } from '../../components/Common';
import { BRAND } from '../../lib/site';

const TITLE = `커튼·블라인드 고르는 법 | ${BRAND}`;
const DESC = '암막 원단 차이, 커튼 길이 재는 법, 레일과 봉, 콤비·우드·버티컬블라인드 비교, 세탁과 관리까지 커튼·블라인드를 고르기 전에 궁금한 것을 하나씩 정리합니다.';
const og = ogImages('blog', '커튼·블라인드 고르는 법');
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': '/rss.xml' } },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title: TITLE, description: DESC, url: '/blog/', images: og },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: og },
};

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '블로그', path: '/blog/' }]),
        pathListJsonLd(posts.map((p) => ({ name: p.title, path: postEncodedPath(p) }))),
      ]} />
      <div className="wrap content page-top">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span>블로그</nav>
        <h1 className="page-title">커튼·블라인드 고르는 법</h1>
        <p className="prose-p">원단, 길이, 레일, 블라인드 방식처럼 실측 전에 자주 받는 질문을 한 편에 하나씩 답합니다. 동네별 방문 실측 안내는 <Link href="/area/">지역 페이지</Link>에 있습니다.</p>
        <section>
          <h2 className="area-h">최근 글</h2>
          {posts.length ? (
            <ul className="post-list reveal-group">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={postPath(p)}>
                    <time dateTime={p.publishedAt}>{p.publishedAt.replace(/-/g, '.')}</time>
                    <strong>{p.title}</strong>
                    <span>{p.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="prose-p">첫 글을 준비하고 있습니다. 그동안 궁금한 점은 전화나 문자로 물어보세요.</p>
          )}
        </section>
      </div>
      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>창 사진부터 보내주세요</h2>
          <p>창 전체와 천장이 보이게 찍은 사진, 대략적인 가로·세로만 있으면 맞는 방식을 먼저 안내합니다.</p>
          <Actions dark />
        </div>
      </section>
    </main>
  );
}

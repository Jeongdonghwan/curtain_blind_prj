import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, getPage, pagePath, pageEncodedPath, canonicalPath, related } from '../../lib/data';
import { compose } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, ogImages, serviceJsonLd } from '../../lib/jsonld';
import { Actions, FixedLinks, IconArrow, JsonLd, LightScale, SectionHead, Trio } from '../../components/Common';
import { photosFor, shortName } from '../../lib/photos';

export const dynamicParams = false;
export function generateStaticParams() { return OPEN_PAGES.map((p) => ({ slug: p.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = compose(p);
  const url = canonicalPath(p);
  const images = ogImages(p.variantOf || p.slug, p.kw);
  return { title: c.title, description: c.description, alternates: { canonical: url }, openGraph: { title: c.title, description: c.description, url, images }, twitter: { card: 'summary_large_image', title: c.title, description: c.description, images } };
}

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const rel = related(p);
  const ph = photosFor(p.word, p.slug);
  const path = pageEncodedPath(p);

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, description: c.description, path, area: c.area }),
        faqJsonLd(c.faq),
        itemListJsonLd([...rel.samePlace, ...rel.sameCity, ...rel.otherCities]),
      ]} />

      <section className="hero hero-kw">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/area/">지역</Link><span>/</span>{p.kw}</nav>
            <h1 className="hero-title"><span>{p.kw}</span></h1>
            <p className="hero-lead">{c.lead}</p>
            <Actions />
            <dl className="hero-specs">{c.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
          <figure className="hero-photo mask" data-reveal>
            <img src={ph.hero.file} alt={`${c.area} ${p.word} — 디자인그리다 ${shortName(ph.hero)} 제품 사진`} width={ph.hero.w} height={ph.hero.h} />
            <figcaption>사진 · 디자인그리다 제품 ({shortName(ph.hero)})</figcaption>
          </figure>
        </div>
      </section>
      <FixedLinks />

      <div className="wrap content">
        <section className="sec intro">
          <div className="prose" data-reveal>{c.intro.map((t, i) => <p key={i} className={i === 0 ? 'first' : ''}>{t}</p>)}</div>
        </section>

        <section className="sec" id="photos">
          <SectionHead title={c.photoHeading} sub={c.photoSub} />
          <Trio pics={ph.gallery.map((x) => ({ file: x.file, w: x.w, h: x.h, alt: `${c.area} ${p.word} 참고 — 디자인그리다 ${x.cat} ${shortName(x)}`, cap: `${shortName(x)} · ${x.cat}` }))} />
          <div className="catlist" data-reveal>
            {ph.cats.map((k) => <div key={k.cat}><h3><a href={k.url} target="_blank" rel="noopener">{k.cat}</a></h3><ul>{k.sub.map((x) => <li key={x}>{x}</li>)}</ul></div>)}
          </div>
        </section>

        <section className="sec stone" id="light">
          <SectionHead title={c.lightHeading} sub={c.lightSub} />
          <LightScale on={c.lightOn} text={c.lightText} />
        </section>

        <section className="sec">
          <SectionHead title={c.region.heading} />
          <div className="cols">
            <p className="region-body" data-reveal>{c.region.body}</p>
            <dl className="info" data-reveal>{c.region.dl.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
        </section>

        <section className="sec">
          <SectionHead title={c.roomsHeading} />
          <ul className="rooms reveal-group">{c.rooms.map((r) => <li key={r.room}><h3>{r.room}</h3><p>{r.text}</p></li>)}</ul>
        </section>

        <section className="sec stone">
          <SectionHead title={c.checksHeading} />
          <ul className="rooms checks reveal-group">{c.checks.map((r) => <li key={r.t}><h3>{r.t}</h3><p>{r.d}</p></li>)}</ul>
        </section>
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-band-in"><p>창 사진과 <em>대략적인 크기</em>만 보내주세요.</p><Actions dark /></div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead title="상담부터 점검까지" />
          <ol className="timeline reveal-group">{c.steps.map((st) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p></li>)}</ol>
        </section>

        <section className="sec stone">
          <SectionHead title="고르기 전에 볼 것" />
          <div className="lists" data-reveal>
            <div><h3>실측 전 확인</h3><ul className="check">{c.signs.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><h3>자주 놓치는 점</h3><ul className="warn">{c.pitfalls.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
        </section>

        <section className="sec">
          <SectionHead title="커튼·블라인드 방식" />
          <table className="cmp" data-reveal><thead><tr><th scope="col">방식</th><th scope="col">특징</th></tr></thead><tbody>{c.types.map((x) => <tr key={x.name}><th scope="row">{x.name}</th><td>{x.d}</td></tr>)}</tbody></table>
        </section>

        <section className="sec stone faq-ed" id="faq">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">{c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>

        <section className="sec related">
          {rel.samePlace.length > 0 && <div><h3>{p.region} 다른 안내</h3><ul>{rel.samePlace.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
          {rel.sameCity.length > 0 && <div><h3>{c.city.name} {p.word}</h3><ul>{rel.sameCity.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
          {rel.otherCities.length > 0 && <div><h3>가까운 도시 {p.word}</h3><ul>{rel.otherCities.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <Actions dark />
          <FixedLinks compact />
        </div>
      </section>
    </main>
  );
}

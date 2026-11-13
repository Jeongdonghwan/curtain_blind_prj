// 디자인그리다 홈페이지(design8282.com)에서 가져온 제품 사진·카테고리 — 출처는 data/source.json.
// 홈페이지 사진은 제품 연출 사진이라 "시공 사진"이 아니라 "제품 사진"으로 표기한다.
import src from '../data/source.json';
import { hash } from './data';

export interface Photo { file: string; w: number; h: number; shape: string; topic: string; cat: string; product: string; page: string }
export const PHOTOS = src.photos as Photo[];
export const CATEGORIES = src.categories as { cat: string; url: string; sub: string[] }[];
export const SOURCE_URL = src.site;

// 제품명에서 "(견적문의)" 같은 꼬리 제거
export const shortName = (p: Photo) => p.product.replace(/\s*\(.*?\)\s*$/, '').replace(/\(견적문의\)/, '').trim();
const by = (...topics: string[]) => PHOTOS.filter((p) => topics.includes(p.topic));

// 키워드 단어 → 사진 주제(data/source.json wordTopics — scripts/make_og.py 도 같은 값을 씀)·홈페이지 카테고리
const WORD_TOPICS = src.wordTopics as Record<string, string[]>;
const WORD_CATS: Record<string, string[]> = {
  암막커튼: ['커튼'], 암막커튼설치: ['커튼'], 커튼: ['커튼', '홀딩도어'], 맞춤커튼: ['커튼'], 커튼집: ['커튼', '콤비롤스크린'], 커튼설치: ['커튼'], 전동커튼: ['커튼'],
  커튼블라인드: ['커튼', '콤비롤스크린', '트리플쉐이드'], 블라인드: ['콤비롤스크린', '우드블라인드', '알루미늄'], 블라인드설치: ['콤비롤스크린', '알루미늄', '허니콤쉐이드'],
  암막블라인드: ['콤비롤스크린', '항균블라인드', '허니콤쉐이드'], 롤스크린: ['롤스크린·버티칼'], 콤비블라인드: ['콤비롤스크린', '항균블라인드'],
  우드블라인드: ['우드블라인드', '알루미늄'], 버티컬블라인드: ['롤스크린·버티칼'],
};

const rot = <T,>(arr: T[], seed: string) => { if (!arr.length) return arr; const k = hash(seed) % arr.length; return [...arr.slice(k), ...arr.slice(0, k)]; };

// 페이지 히어로 배경(가로 사진 우선) + 본문 사진 3장
export function photosFor(word: string, slug: string) {
  const topics = WORD_TOPICS[word] || ['curtain'];
  const pool = by(...topics);
  // 히어로: 첫 주제의 가로 사진 → 다른 주제 가로 사진 → 아무 사진 (scripts/make_og.py hero_photo 와 같은 순서)
  const wides = pool.filter((p) => p.shape === 'wide');
  const main = wides.filter((p) => p.topic === topics[0]);
  const heroPool = main.length ? main : wides.length ? wides : pool;
  const hero = heroPool[hash(`${slug}::hero`) % heroPool.length];
  const rest = rot(pool.filter((p) => p !== hero), `${slug}::gal`);
  // 첫 장은 가로 사진, 나머지는 정사각 섞어서
  const gallery = [...rest.filter((p) => p.shape === 'wide').slice(0, 1), ...rest.filter((p) => p.shape === 'square').slice(0, 2)];
  return { hero, gallery: gallery.length >= 3 ? gallery : rest.slice(0, 3), cats: CATEGORIES.filter((c) => (WORD_CATS[word] || ['커튼']).includes(c.cat)).map((c) => ({ ...c, sub: rot(c.sub, `${slug}::${c.cat}`).slice(0, 4) })) };
}

// 메인: 카테고리마다 대표 사진 1장
export const CAT_COVER: Record<string, string> = {
  커튼: '/img/curtain-stone-blue.jpg', 콤비롤스크린: '/img/combi-pluto-grey.jpg', 항균블라인드: '/img/combi-bio-elis.jpg',
  '롤스크린·버티칼': '/img/sq-vertical-amuzen.jpg', 트리플쉐이드: '/img/triple-grey.jpg', 우드블라인드: '/img/wood-odong-white.jpg',
  알루미늄: '/img/alu-25-wood.jpg', 허니콤쉐이드: '/img/honeycomb-duotone.jpg', 홀딩도어: '/img/sq-folding-double.jpg',
};
export const photo = (file: string) => PHOTOS.find((p) => p.file === file)!;

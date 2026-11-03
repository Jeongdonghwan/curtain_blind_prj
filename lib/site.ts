// 사이트 설정 — 연락처·고정 링크·사업자 정보. TODO 표시는 업체 정보를 받으면 채운다.

export const SITE_URL = process.env.SITE_URL || 'https://xn--2i0bj7g70bpwhsyude.kr'; // 디자인그리다.kr (퓨니코드)
export const BRAND = '디자인그리다 커튼·블라인드';
export const BRAND_EN = 'CURTAIN & BLIND';

export const CONTACT = {
  phone: '010-5566-4204',
  sms: '010-5566-4204',
  kakao: '',
  hours: '아침 7시~저녁 9시 · 365일 연중무휴', // design8282.com 하단 근무시간
};

// 페이지마다 고정으로 넣을 외부 링크. 비어 있으면 띠를 숨긴다.
export const LINKS: { label: string; sub: string; url: string }[] = [
  { label: '디자인그리다 커튼·블라인드', sub: '커튼·블라인드 제품 보기', url: 'https://www.design8282.com' },
];

// 사업자등록증 기준 (업태 도소매 / 종목 커튼 및 블라인드 — 표시 필드 없음)
export const BUSINESS = {
  name: '공장직영 디자인그리다 커튼 블라인드',
  ceo: '김용수',
  bizNumber: '828-05-00330',
  address: '세종특별자치시 한누리대로 321, 107호(나성동, SR파크시티)',
};

export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 4); // 1~4 묶음 (scripts/import_pages.py 가 4등분)
export const MERGE_VARIANTS = true;

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const smsHref = `sms:${CONTACT.sms.replace(/[^0-9]/g, '')}`;

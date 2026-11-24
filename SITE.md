# 디자인그리다 커튼·블라인드 (디자인그리다.kr)

## 순차 오픈

`data/drip.json` 을 `scripts/drip/drip_status.py` 가 읽어 오늘 묶음(OPEN_WAVE)을 정한다. 빌드는 `OPEN_WAVE` 이하 페이지만 포함.

| 묶음 | 날짜 | 페이지 |
|---|---|---|
| 1~4 | 11/3 ~ 11/9 | 기존 2,000 (커튼블라인드_지역키워드.xlsx 1~2,000행) |
| 5 | 11/15 | 추가 500 |
| 6 | 11/17 | 추가 500 |
| 7 | 11/19 | 추가 500 |

**추가 키워드 1,500개 (2026-11-13, wave 5·6·7)** — `python -I scripts/add_extra_pages.py` 가
`region_kw_prj/keywords/커튼블라인드_지역키워드.xlsx` 의 2,001행부터 위에서 1,500개(이미 있는 슬러그·표기 변형 제외)를
site-pages.json 뒤에 붙이고 `keywords/그리다커튼_추가키워드.xlsx` 를 만든다. 동·읍면 × 커튼·블라인드·커튼블라인드(·암막블라인드).
날짜는 `data/drip.json` 의 `extra`. 새 페이지 og 카드는 `python -I scripts/make_og.py`.

## h1 수식어·레이 구조 적용(2026-11-24)
키워드 페이지(`app/[slug]/page.tsx`, 조합 `lib/compose.ts` 의 `ray`·description)를 레이 모범 구조로: 분류 줄 → h1(`키워드` + `.hero-sub` 수식어, 주제별 2벌 + 대표 동네 1벌 해시 선택) → 설명 → "{키워드} 핵심 요약"(결론 + 사실 4칸) → 번호 절 6개(한 문단, 4개 h2 에 키워드 전체) → "{키워드} 자주 묻는 질문" → 제품 사진 3장 → 관련 링크 3묶음(최대 12개). 빛 막는 정도 그림·분류 목록·비교표는 문단으로 옮김. description 45~80자(키워드 — 관련 키워드 + 이웃 동네 + 전화). 주소·title·canonical 그대로. 점검 `python -I scripts/ray_check.py out`.
측정(열린 5,500쪽, OPEN_WAVE=11): h1 중복 0 · 키워드 든 h2 6개 이상/쪽 · 본문(main) 평균 2,151자 · 절 문단 평균 198자 · 같은 단어 페이지 같은 문장 평균 최고 26%(쌍 최대 64%) · description 55~80자 중복 0 · 조사 오류 0(기존 '아파트은' 조사 오류도 고침).
title: 키워드 페이지 title 을 "키워드 수식어 | 상호"로 변경(2026-11-24) — 앞부분은 h1 과 같은 글자, 앞부분 40자·전체 60자 이하(넘으면 짧은 수식어 벌), og·twitter·rss 같은 값, og:site_name 상호. 빌드 없는 점검 `node scripts/title_check.js <OPEN_WAVE>` (중복 0 · h1 불일치 0).

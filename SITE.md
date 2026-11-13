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

"""오픈 뒤 추가 키워드 페이지(wave 5·6·7) → data/site-pages.json 뒤에 붙이고 keywords/그리다커튼_추가키워드.xlsx 작성

  python -I scripts/add_extra_pages.py

출처: region_kw_prj/keywords/커튼블라인드_지역키워드.xlsx — 기존 2,000개(1~2,000행) 다음 행부터 위에서 1,500개.
같은 슬러그나 표기만 다른 쌍(같은 시·단어·지역 끝말)이 이미 있으면 건너뛴다(canonical 묶음 페이지는 색인 안 되므로).
앞 500 = wave 5, 다음 500 = 6, 나머지 = 7 — 날짜는 data/drip.json extra.
다시 돌려도 같은 결과(wave 5 이상을 지우고 다시 붙인다). 기존 페이지는 건드리지 않는다.
"""
import json, os, re, sys
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font
from openpyxl.utils import get_column_letter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '..', 'region_kw_prj', 'keywords', '커튼블라인드_지역키워드.xlsx')
PAGES = os.path.join(ROOT, 'data', 'site-pages.json')
XLSX = os.path.join(ROOT, 'keywords', '그리다커튼_추가키워드.xlsx')
DOMAIN = 'https://디자인그리다.kr'
N, DONE = 1500, 2000
drip = json.load(open(os.path.join(ROOT, 'data', 'drip.json'), encoding='utf-8'))
DATES = {x['wave']: x['date'] for x in drip['extra']}

norm = lambda n: re.sub(r'(구|시|군)$', '', n.split(' ')[-1])  # import_pages.py 와 같은 표기 변형 키
data = json.load(open(PAGES, encoding='utf-8'))
pages = [p for p in data['pages'] if p['wave'] <= 4]
have = {p['slug'] for p in pages}
keys = {(p['city'], p['word'], norm(p['region'])) for p in pages}

rows = list(load_workbook(SRC, read_only=True)['키워드'].iter_rows(values_only=True))[1 + DONE:]
new = []
for rank, kw, _, word, region, level, city, sido, *_ in rows:
    slug, key = kw.replace(' ', '-'), (city, word, norm(region))
    if slug in have or key in keys:
        continue
    have.add(slug); keys.add(key)
    new.append(dict(rank=rank, kw=kw, slug=slug, word=word, region=region, level=level, city=city, sido=sido, wave=5 + min(2, len(new) // 500)))
    if len(new) == N:
        break

data['pages'] = pages + new
json.dump(data, open(PAGES, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

os.makedirs(os.path.dirname(XLSX), exist_ok=True)
wb = Workbook()
ws = wb.active
ws.title = '키워드'
ws.append(['순번', '키워드', 'URL', '우선순위', '오픈 묶음', '오픈일'])
for i, p in enumerate(new, 1):
    ws.append([i, p['kw'], f'{DOMAIN}/{p["slug"]}/', p['rank'], p['wave'], DATES[p['wave']]])
for c in ws[1]: c.font = Font(bold=True)
for i, w in enumerate([7, 26, 52, 9, 9, 12], 1): ws.column_dimensions[get_column_letter(i)].width = w
ws.freeze_panes = 'A2'
ws.auto_filter.ref = ws.dimensions
wb.save(XLSX)

sys.stdout.reconfigure(encoding='utf-8')
from collections import Counter
print('추가', len(new), dict(Counter(p['wave'] for p in new)), '원본 행', new[0]['rank'], '~', new[-1]['rank'])
print(Counter((p['level'], p['word']) for p in new))

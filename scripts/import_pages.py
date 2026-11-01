"""region_kw_prj/pages/<이름>.json(사용자 파일 위에서부터 N개) → data/site-pages.json

  python -I scripts/import_pages.py 방충망

- 표기만 다른 쌍(청주/청주시, 상당/상당구 …)은 variantOf 로 대표 페이지 표시
- 오픈 묶음(wave): 시·구 먼저(파일 순서) 정렬 뒤 위에서부터 4등분 → 1~4 (post-launch 나눠 열기).
  표기 변형은 대표 페이지와 같은 묶음. 빌드 시 OPEN_WAVE 이하만 공개.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
name = sys.argv[1]
pages = json.load(open(os.path.join(ROOT, '..', 'region_kw_prj', 'pages', f'{name}.json'), encoding='utf-8'))['pages']
norm = lambda n: re.sub(r'(구|시|군)$', '', n.split(' ')[-1])
main = {}
for p in pages:
    p['wave'] = 1 if p['level'] in ('시', '구') else 2
    key = (p['city'], p['word'], norm(p['region']), p['wave'])
    if key in main:
        p['variantOf'] = main[key]
    else:
        main[key] = p['slug']
pages.sort(key=lambda p: (p['wave'], p['rank']))  # 시·구 먼저
for i, p in enumerate(pages): p['wave'] = 1 + i * 4 // len(pages)
w = {p['slug']: p['wave'] for p in pages}
for p in pages:
    if 'variantOf' in p: p['wave'] = w[p['variantOf']]
assert len({p['slug'] for p in pages}) == len(pages)
json.dump({'pages': pages}, open(os.path.join(ROOT, 'data', 'site-pages.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
sys.stdout.reconfigure(encoding='utf-8')
print(name, 'pages', len(pages), 'variants', sum(1 for p in pages if 'variantOf' in p), 'waves', [sum(1 for p in pages if p['wave'] == k) for k in (1, 2, 3, 4)])

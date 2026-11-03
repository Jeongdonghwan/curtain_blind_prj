"""OG 카드 생성: public/og/<slug>.jpg + home.jpg + area.jpg + blog.jpg + blog-<글 slug>.jpg (1200x630, JPEG 80).
배경 = 디자인그리다 홈페이지 제품 사진(public/img, data/source.json). 페이지 히어로와 같은 사진을 고른다(lib/photos.ts photosFor 와 같은 규칙).
글자는 네이버 정사각 자르기에 맞춰 가운데 630x630 안에 둔다.
사용: python -I scripts/make_og.py [--force]   (브랜드·전화는 lib/site.ts에서 읽음, 있는 파일은 --force 없으면 건너뜀)"""
import datetime, json, os, re, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630
ACCENT, SOFT, INK = '#b4532a', '#f3b48f', (26, 31, 43)  # globals.css --green/--mint/--ink
X0, MAXW = 300, 600  # 정사각 안전영역(285~915) 안쪽
FORCE = '--force' in sys.argv

site = (ROOT / 'lib/site.ts').read_text(encoding='utf-8')
BRAND = re.search(r"BRAND = '([^']+)'", site).group(1)
PHONE = re.search(r"phone: '([^']+)'", site).group(1)
SRC = json.loads((ROOT / 'data/source.json').read_text(encoding='utf-8'))
PHOTOS, TOPICS = SRC['photos'], SRC['wordTopics']
_fonts = {}
def font(bold, size):
    k = (bold, size)
    if k not in _fonts:
        _fonts[k] = ImageFont.truetype('C:/Windows/Fonts/' + ('malgunbd.ttf' if bold else 'malgun.ttf'), size)
    return _fonts[k]

def fnv(s):  # lib/data.ts hash 와 같은 FNV-1a (한글은 모두 BMP라 문자 = UTF-16 단위)
    h = 2166136261
    for ch in s:
        h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return h

def hero_photo(word, slug):
    topics = TOPICS.get(word, ['curtain'])
    pool = [p for p in PHOTOS if p['topic'] in topics]
    wides = [p for p in pool if p['shape'] == 'wide']
    hp = [p for p in wides if p['topic'] == topics[0]] or wides or pool
    return hp[fnv(f'{slug}::hero') % len(hp)]

def background(file):
    im = Image.open(ROOT / 'public' / file.lstrip('/')).convert('RGB')
    s = max(W / im.width, H / im.height)
    im = im.resize((int(im.width * s) + 1, int(im.height * s) + 1), Image.LANCZOS)
    im = im.crop(((im.width - W) // 2, (im.height - H) // 2, (im.width - W) // 2 + W, (im.height - H) // 2 + H))
    im = ImageEnhance.Brightness(im).enhance(0.55)
    return Image.blend(im, Image.new('RGB', (W, H), INK), 0.5)  # 네이비를 덮어 사이트 톤과 맞춤

def fit(title):
    """| 로 줄 지정 가능. 한 줄로 들어가면 한 줄, 아니면 마지막 공백에서 두 줄. (줄들, 크기)"""
    opts = [title.split('|')] if '|' in title else [[title], title.rsplit(' ', 1)]
    for lines in opts:
        for size in range(96, 51, -4):
            if all(font(True, size).getlength(l) <= MAXW for l in lines):
                return lines, size
    return lines, 52

def card(title, photo_file, out, label):
    if out.exists() and not FORCE: return 0
    im = background(photo_file)
    d = ImageDraw.Draw(im)
    d.rectangle((X0 - 18, 150, X0 - 8, 480), fill=ACCENT)
    d.text((X0, 160), label, font=font(False, 26), fill=SOFT)
    lines, size = fit(title)
    y = 315 - len(lines) * size * 0.62
    for l in lines:
        d.text((X0, y), l, font=font(True, size), fill='#ffffff')
        y += int(size * 1.2)
    yb = max(440, y + 18)  # 두 줄 제목이면 아래로 밀기
    d.text((X0, yb), BRAND, font=font(True, 30), fill='#ffffff')
    d.text((X0, yb + 42), PHONE, font=font(True, 34), fill=SOFT)
    im.save(out, 'JPEG', quality=80, optimize=True, progressive=True)
    return 1

def blog_posts():
    """content/blog/*.md ('_' 로 시작하면 비공개, date/publishedAt 이 빌드일보다 미래면 제외 — lib/blog.ts 와 같은 규칙)
    → [(slug, keyword 또는 title, industry)]"""
    today = os.environ.get('BUILD_DATE') or datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).date().isoformat()
    out = []
    for f in sorted((ROOT / 'content' / 'blog').glob('*.md')):
        if f.name.startswith('_'):
            continue
        raw = f.read_text(encoding='utf-8')
        head = raw.split('---', 2)[1] if raw.startswith('---') else ''
        meta = {k.strip(): v.strip().strip("'") for k, v in (l.split(':', 1) for l in head.splitlines() if ':' in l)}
        if meta.get('slug') and (meta.get('date') or meta.get('publishedAt') or '') <= today:
            out.append((meta['slug'], meta.get('keyword') or meta.get('title', ''), meta.get('industry') or '커튼'))
    return out

if __name__ == '__main__':
    od = ROOT / 'public/og'
    od.mkdir(parents=True, exist_ok=True)
    pages = json.loads((ROOT / 'data/site-pages.json').read_text(encoding='utf-8'))['pages']
    n = card('창 크기대로,|빛은 원하는 만큼', '/img/curtain-hj-darkgrey.jpg', od / 'home.jpg', '공장직영 커튼·블라인드')
    n += card('지역별 커튼·블라인드', '/img/curtain-stone-blue.jpg', od / 'area.jpg', '공장직영 커튼·블라인드')
    n += card('커튼·블라인드 고르는 법', '/img/curtain-stone-blue.jpg', od / 'blog.jpg', '공장직영 커튼·블라인드')
    for slug, kw, word in blog_posts():  # 블로그 글: blog-<slug>.jpg, 사진은 글 페이지 히어로와 같은 규칙
        n += card(kw, hero_photo(word, f'blog-{slug}')['file'], od / f'blog-{slug}.jpg', '커튼·블라인드 고르는 법')
    for p in pages:
        if not p.get('variantOf'):  # 변형 페이지는 대표 페이지 이미지를 쓴다
            n += card(p['kw'], hero_photo(p['word'], p['slug'])['file'], od / f"{p['slug']}.jpg", p['word'])
    print(n, 'cards ->', od)

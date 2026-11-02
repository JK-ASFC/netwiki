#!/usr/bin/env python3
"""Génère les icônes et écrans de démarrage Android de NetWiki à partir de build/icon.png.
   python3 scripts/make-android-icons.py
Copyright (c) 2026 JK-ASFC — licence MIT."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = Image.open(ROOT / 'build' / 'icon.png').convert('RGBA')
RES = ROOT / 'mobile' / 'android' / 'app' / 'src' / 'main' / 'res'
FOND = (11, 13, 20, 255)          # #0b0d14, fond de l'application

DENS = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}


def glyphe(src):
    """Pictogramme blanc seul (pixels clairs de l'icône), recadré."""
    px = src.load()
    w, h = src.size
    out = Image.new('RGBA', src.size, (0, 0, 0, 0))
    po = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            m = min(r, g, b)
            if a > 0 and m > 150:
                alpha = int(max(0, min(255, (m - 150) * 255 / 95)) * a / 255)
                po[x, y] = (255, 255, 255, alpha)
    return out.crop(out.getbbox())


def degrade(taille):
    """Fond de l'icône adaptative : dégradé violet → cyan avec halo, comme l'icône d'origine."""
    w = taille
    im = Image.new('RGBA', (w, w))
    d = im.load()
    c1, c2 = (124, 132, 241), (18, 176, 214)
    for y in range(w):
        for x in range(w):
            t = (x + y) / (2 * (w - 1))
            d[x, y] = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)) + (255,)
    halo = Image.new('RGBA', (w, w), (0, 0, 0, 0))
    ImageDraw.Draw(halo).ellipse([w * 0.05, w * 0.0, w * 0.65, w * 0.6], fill=(255, 255, 255, 70))
    halo = halo.filter(ImageFilter.GaussianBlur(w * 0.12))
    return Image.alpha_composite(im, halo)


G = glyphe(SRC)
FOND_ICONE = degrade(432)


def premier_plan(taille, part=0.46):
    im = Image.new('RGBA', (taille, taille), (0, 0, 0, 0))
    g = G.copy()
    g.thumbnail((int(taille * part), int(taille * part)), Image.LANCZOS)
    im.alpha_composite(g, ((taille - g.width) // 2, (taille - g.height) // 2))
    return im


def rond(img):
    m = Image.new('L', img.size, 0)
    ImageDraw.Draw(m).ellipse([0, 0, img.width - 1, img.height - 1], fill=255)
    out = Image.new('RGBA', img.size, (0, 0, 0, 0))
    out.paste(img, (0, 0), m)
    return out


for nom, f in DENS.items():
    d = RES / f'mipmap-{nom}'
    d.mkdir(parents=True, exist_ok=True)
    t = int(48 * f)
    SRC.resize((t, t), Image.LANCZOS).save(d / 'ic_launcher.png')
    r = FOND_ICONE.resize((t, t), Image.LANCZOS)
    r.alpha_composite(premier_plan(t, 0.6))
    rond(r).save(d / 'ic_launcher_round.png')
    fg = int(108 * f)
    premier_plan(fg).save(d / 'ic_launcher_foreground.png')
    FOND_ICONE.resize((fg, fg), Image.LANCZOS).save(d / 'ic_launcher_background.png')
    # Petite icône de notification : silhouette blanche
    dn = RES / f'drawable-{nom}'
    dn.mkdir(parents=True, exist_ok=True)
    n = int(24 * f)
    ic = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    g = G.copy()
    g.thumbnail((int(n * 0.86), int(n * 0.86)), Image.LANCZOS)
    ic.alpha_composite(g, ((n - g.width) // 2, (n - g.height) // 2))
    ic.save(dn / 'ic_stat_netwiki.png')

# Icône adaptative : fond en image (dégradé) + pictogramme
(RES / 'mipmap-anydpi-v26').mkdir(exist_ok=True)
xml = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
'''
for f in ('ic_launcher.xml', 'ic_launcher_round.xml'):
    (RES / 'mipmap-anydpi-v26' / f).write_text(xml)
for vieux in [RES / 'drawable-v24' / 'ic_launcher_foreground.xml', RES / 'drawable' / 'ic_launcher_background.xml']:
    vieux.unlink(missing_ok=True)

# Écrans de démarrage (Android < 12) : logo centré sur fond sombre
def ecran(w, h):
    im = Image.new('RGBA', (w, h), FOND)
    t = int(min(w, h) * 0.28)
    im.alpha_composite(SRC.resize((t, t), Image.LANCZOS), ((w - t) // 2, (h - t) // 2))
    return im.convert('RGB')

TAILLES = {'mdpi': (320, 480), 'hdpi': (480, 800), 'xhdpi': (720, 1280), 'xxhdpi': (960, 1600), 'xxxhdpi': (1280, 1920)}
for nom, (w, h) in TAILLES.items():
    for orient, (a, b) in (('port', (w, h)), ('land', (h, w))):
        d = RES / f'drawable-{orient}-{nom}'
        d.mkdir(parents=True, exist_ok=True)
        ecran(a, b).save(d / 'splash.png')
ecran(480, 800).save(RES / 'drawable' / 'splash.png')
# Icône animée de l'écran de démarrage (Android 12+) : 288 dp, pictogramme dans le cercle central
for nom, f in DENS.items():
    t = int(288 * f)
    im = Image.new('RGBA', (t, t), (0, 0, 0, 0))
    ic = SRC.resize((int(t * 0.42), int(t * 0.42)), Image.LANCZOS)
    im.alpha_composite(ic, ((t - ic.width) // 2, (t - ic.height) // 2))
    im.save(RES / f'drawable-{nom}' / 'splash_icon.png')
print('Icônes Android générées dans', RES)

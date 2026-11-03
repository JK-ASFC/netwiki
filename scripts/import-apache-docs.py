#!/usr/bin/env python3
# NetWiki — import de la documentation de référence d'Apache HTTP Server 2.4 (commandes, guides, modules, directives).
# Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
#
# Source : documentation officielle d'Apache HTTP Server (dépôt apache/httpd, branche 2.4.x, dossier docs/manual),
# licence Apache 2.0, traduction française de la Fondation Apache quand elle existe (fichiers *.xml.fr).
#
#   git clone --depth 1 --filter=blob:none --sparse -b 2.4.x https://github.com/apache/httpd.git httpd
#   git -C httpd sparse-checkout set docs/manual
#   python3 scripts/import-apache-docs.py httpd/docs/manual content/05-web/02-apache
#
# Régénère les dossiers 10-commandes, 11-guides, 12-modules et 13-directives (les autres articles ne sont pas touchés).

import html.entities
import json
import os
import re
import shutil
import sys
import unicodedata

from lxml import etree

SRC = os.path.abspath(sys.argv[1])
OUT = os.path.abspath(sys.argv[2])
ENT = {'nbsp': ' '}
for m in re.finditer(r'<!ENTITY\s+([\w.]+)\s+"([^"]*)"', open(os.path.join(SRC, 'style/version.ent'), encoding='utf-8').read()):
    ENT[m.group(1)] = m.group(2)
VERSION = f"{ENT.get('httpd.major', '2')}.{ENT.get('httpd.minor', '4')}.{ENT.get('httpd.patch', 'x')}"

D_CMD, D_GUIDES, D_MODS, D_DIRS = '10-commandes', '11-guides', '12-modules', '13-directives'

GUIDE_GROUPS = [
    ('', '01-generalites', 'Généralités', 'book-open', 'Démarrage, configuration, journaux, MPM, DSO, filtres, expressions, mise à niveau et autres sujets généraux.'),
    ('howto', '02-guides-pratiques', 'Guides pratiques', 'graduation-cap', 'Tutoriels : contrôle d’accès, authentification, CGI, .htaccess, HTTP/2, reverse proxy, SSI, répertoires utilisateurs.'),
    ('vhosts', '03-serveurs-virtuels', 'Serveurs virtuels', 'server', 'Serveurs virtuels par nom ou par adresse IP, exemples, hébergement de masse et détails de la sélection.'),
    ('ssl', '04-chiffrement-ssl-tls', 'Chiffrement SSL/TLS', 'lock', 'Introduction, compatibilité, guide pratique et questions fréquentes sur mod_ssl.'),
    ('rewrite', '05-reecriture-mod-rewrite', 'Réécriture d’URL (mod_rewrite)', 'shuffle', 'Introduction, drapeaux, RewriteMap, redirections, contrôle d’accès, mandataire et techniques avancées.'),
    ('misc', '06-divers', 'Divers', 'shapes', 'Performances, conseils de sécurité, formats de mots de passe et normes applicables.'),
    ('platform', '07-plates-formes', 'Plates-formes', 'monitor', 'Notes propres à Windows, aux systèmes RPM, à NetWare et à EBCDIC.'),
    ('faq', '08-faq', 'Questions fréquentes', 'circle-help', 'Foire aux questions de la documentation Apache.'),
    ('developer', '09-developpement', 'Développement de modules', 'code-xml', 'Documentation pour les développeurs de modules (API, hooks, filtres, traitement des requêtes) — texte original en anglais.'),
]
SKIP_GUIDES = {'index.xml', 'sitemap.xml'}

CONTEXTS = {'server config': 'configuration du serveur', 'virtual host': 'serveur virtuel', 'directory': 'répertoire', '.htaccess': '.htaccess', 'proxy': 'mandataire'}
STATUS = {'core': 'Noyau', 'mpm': 'MPM', 'base': 'Base', 'extension': 'Extension', 'experimental': 'Expérimental', 'external': 'Externe'}
LANGS = {'config': 'apache', 'sh': 'bash', 'bash': 'bash', 'perl': 'perl', 'c': 'c', 'lua': 'lua', 'html': 'xml', 'python': 'python'}
NOTE_TITLES = {'warning': 'WARNING', 'hint': 'TIP'}


def slug(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')[:70] or 'page'


def load(path):
    s = open(path, encoding='utf-8').read()
    s = re.sub(r'<!DOCTYPE[^>\[]*(\[.*?\])?>', '', s, flags=re.S)

    def rep(m):
        n = m.group(1)
        if n in ('lt', 'gt', 'amp', 'quot', 'apos'):
            return m.group(0)
        if n in ENT:
            return ENT[n]
        if n in html.entities.name2codepoint:
            return chr(html.entities.name2codepoint[n])
        return m.group(0)

    return etree.fromstring(re.sub(r'&([A-Za-z][\w.]*);', rep, s).encode())


def localized(rel):
    fr = os.path.join(SRC, rel + '.fr')
    return (fr, True) if os.path.exists(fr) else (os.path.join(SRC, rel), False)


# ------------------------------------------------------------------ inventaire des pages et des cibles de liens

pages = {}  # chemin source html (« mod/mod_alias.html ») → (lien wiki, titre)
directives = {}  # nom en minuscules → infos (première définition)
variants = {}  # nom en minuscules → {module: infos}
modules = {}  # nom → infos
guides = []  # (fichier xml relatif, groupe)


def text_of(el):
    return re.sub(r'\s+', ' ', ''.join(el.itertext())).strip() if el is not None else ''


def dir_label(name, section):
    return f'<{name}>' if section else name


for f in sorted(os.listdir(os.path.join(SRC, 'mod'))):
    if not f.endswith('.xml'):
        continue
    en = load(os.path.join(SRC, 'mod', f))
    if en.tag != 'modulesynopsis':
        continue
    name = text_of(en.find('name'))
    modules[name] = {'file': f, 'name': name}
    pages[f'mod/{name}.html'] = (f'{D_MODS}/{name}', name)
    for d in en.findall('directivesynopsis'):
        if d.get('location'):
            continue
        dn = text_of(d.find('name'))
        sec = d.get('type') == 'section'
        info = {'name': dn, 'module': name, 'section': sec, 'slug': slug(dn), 'en': d}
        directives.setdefault(dn.lower(), info)
        variants.setdefault(dn.lower(), {})[name] = info

# Même nom de directive défini par plusieurs modules (ex. HeartbeatStorage) : une page par module.
for key, by_mod in variants.items():
    if len(by_mod) > 1:
        for mod, info in by_mod.items():
            info['slug'] = f"{slug(info['name'])}-{slug(mod)}"


def dget(name, module=None):
    by_mod = variants.get(name.lower())
    if not by_mod:
        return None
    return by_mod.get(module) or next(iter(by_mod.values()))

for f in sorted(os.listdir(os.path.join(SRC, 'programs'))):
    if f.endswith('.xml') and f not in ('index.xml', 'other.xml'):
        n = f[:-4]
        pages[f'programs/{n}.html'] = (f'{D_CMD}/{n}', n)

for sub, folder, *_ in GUIDE_GROUPS:
    d = os.path.join(SRC, sub)
    for f in sorted(os.listdir(d)):
        if not f.endswith('.xml') or (not sub and f in SKIP_GUIDES):
            continue
        rel = f'{sub}/{f}' if sub else f
        root = load(os.path.join(SRC, rel))
        if root.tag != 'manualpage':
            continue
        path, _ = localized(rel)
        title = text_of(load(path).find('title'))
        fname = '00-' + slug(title) if f == 'index.xml' else slug(title)
        pages[rel[:-4] + '.html'] = (f'{D_GUIDES}/{folder}/{fname}', title)
        guides.append((rel, folder, fname))

ALL_DIRS = [i for v in variants.values() for i in v.values()]
assert len({i['slug'] for i in ALL_DIRS}) == len(ALL_DIRS), 'noms de fichiers de directives en double'


# ------------------------------------------------------------------ conversion XML → Markdown

def resolve_href(href, base_rel):
    if re.match(r'^(https?|ftp|mailto):', href):
        return ('url', href)
    target, _, frag = href.partition('#')
    if not target:
        return None
    norm = os.path.normpath(os.path.join(os.path.dirname(base_rel), target)).replace(os.sep, '/')
    if target.endswith('/'):
        norm += '/index.html'
    norm = re.sub(r'\.html(\.[\w-]+)*$', '.html', norm)
    if norm.startswith('mod/') and frag and frag.lower() in variants and norm[4:-5] in variants[frag.lower()]:
        return ('wiki', f"{D_DIRS}/{variants[frag.lower()][norm[4:-5]]['slug']}")
    if norm in pages:
        return ('wiki', pages[norm][0])
    return None


def esc_md(t):
    return re.sub(r'([\\`*_\[\]<>])', r'\\\1', t)


class Conv:
    def __init__(self, rel, assets_dir=None, assets_link=None):
        self.rel = rel  # chemin source (pour les liens relatifs)
        self.assets_dir = assets_dir
        self.assets_link = assets_link
        self.table = 0

    # ---- en ligne
    def inline(self, el, code=False):
        out = esc_inline(el.text, code) if el.text else ''
        for c in el:
            out += self.inline_el(c, code)
            if c.tail:
                out += esc_inline(c.tail, code)
        return out

    def inline_el(self, c, code=False):
        tag = c.tag if isinstance(c.tag, str) else ''
        txt = lambda: re.sub(r'\s+', ' ', ''.join(c.itertext()))
        if not tag:
            return ''
        if code:
            return txt() if tag != 'br' else ' '
        if tag == 'code':
            inner = txt().strip()
            return f'`{inner}`' if inner and '`' not in inner else esc_md(inner)
        if tag == 'directive':
            name = txt().strip()
            d = dget(name, c.get('module'))
            label = dir_label(name, c.get('type') == 'section' or (d and d['section']))
            if d and c.get('module'):
                return self.wl(f"{D_DIRS}/{d['slug']}", label)
            return f'`{label}`'
        if tag == 'module':
            name = txt().strip()
            return self.wl(f'{D_MODS}/{name}', name) if name in modules else f'`{name}`'
        if tag == 'program':
            name = txt().strip()
            return self.wl(f'{D_CMD}/{name}', name) if f'programs/{name}.html' in pages else f'`{name}`'
        if tag in ('em', 'var', 'dfn', 'cite'):
            inner = self.inline(c).strip()
            return f'*{inner}*' if inner else ''
        if tag == 'strong':
            inner = self.inline(c).strip()
            return f'**{inner}**' if inner else ''
        if tag == 'q':
            return f'« {self.inline(c).strip()} »'
        if tag == 'br':
            return ' ' if self.table else '  \n'
        if tag == 'rfc':
            n = txt().strip()
            return f'[RFC {n}](https://www.rfc-editor.org/rfc/rfc{n})'
        if tag == 'glossary':
            return self.inline(c)
        if tag == 'a':
            label = self.inline(c).strip()
            if '[[' in label:
                label = esc_md(txt().strip())
            href = c.get('href')
            if not href:
                return label
            r = resolve_href(href, self.rel)
            if not r:
                return label
            if r[0] == 'url':
                return f'[{label or r[1]}]({r[1]})'
            return self.wl(r[1], re.sub(r'[`*\\]', '', label) or None)
        if tag == 'img':
            return self.image(c)
        return self.inline(c)

    def wl(self, target, label=None):
        label = (label or target.split('/')[-1]).replace(']', ')').replace('|', '/')
        sep = '\\|' if self.table else '|'
        return f'[[{target}{sep}{label}]]'

    def image(self, c):
        src = c.get('src', '')
        file = os.path.normpath(os.path.join(SRC, os.path.dirname(self.rel), src))
        if not self.assets_dir or not os.path.exists(file):
            return ''
        os.makedirs(self.assets_dir, exist_ok=True)
        name = os.path.basename(file)
        shutil.copyfile(file, os.path.join(self.assets_dir, name))
        return f'![{(c.get("alt") or "").strip()}]({self.assets_link}/{name})'

    # ---- blocs
    def blocks(self, el, level=2):
        parts = []
        buf = esc_inline(el.text, False) if el.text and el.text.strip() else ''

        def flush():
            nonlocal buf
            if buf.strip():
                parts.append(norm_ws(buf))
            buf = ''

        for c in el:
            tag = c.tag if isinstance(c.tag, str) else ''
            if tag in BLOCK:
                flush()
                b = self.block(c, level)
                if b and b.strip():
                    parts.append(b)
            elif tag:
                buf += self.inline_el(c)
            if c.tail and c.tail.strip():
                buf += esc_inline(c.tail, False)
            elif c.tail and buf:
                buf += ' '
        flush()
        return '\n\n'.join(parts)

    def block(self, c, level):
        tag = c.tag
        if tag == 'p':
            return norm_ws(self.inline(c))
        if tag == 'section':
            t = c.find('title')
            head = f"{'#' * min(level, 6)} {norm_ws(self.inline(t))}" if t is not None else ''
            body = self.blocks(c, level + 1)
            return f'{head}\n\n{body}' if head else body
        if tag == 'title':
            return ''
        if tag in ('example', 'pre'):
            return self.example(c)
        if tag == 'highlight':
            return self.code(c)
        if tag == 'note':
            kind = NOTE_TITLES.get((c.get('type') or '').lower(), 'NOTE')
            t = c.find('title')
            body = self.blocks(c, level + 1)
            title = f'**{norm_ws(self.inline(t))}**\n\n' if t is not None else ''
            return quote(f'[!{kind}]\n{title}{body}')
        if tag == 'blockquote':
            return quote(self.blocks(c, level))
        if tag in ('ul', 'ol'):
            return self.listing(c, tag == 'ol')
        if tag == 'dl':
            out = []
            for k in c:
                if k.tag == 'dt':
                    term = norm_ws(self.inline(k)).strip().replace('**', '')
                    out.append(f'**{term}**' if term else '')
                elif k.tag == 'dd':
                    out.append(self.blocks(k, level + 1))
            return '\n\n'.join(x for x in out if x.strip())
        if tag == 'table':
            return self.tablemd(c)
        if tag == 'indent':
            return self.blocks(c, level)
        if tag == 'img':
            return self.image(c)
        if tag in ('directivelist', 'modulelist', 'related', 'seealso', 'columnspec', 'category', 'page'):
            return self.relatedlist(c)
        return self.blocks(c, level)

    def relatedlist(self, c):
        items = []
        for k in c.iter():
            if k is c or not isinstance(k.tag, str):
                continue
            if k.tag in ('directive', 'module', 'a', 'program') and k.getparent().tag not in ('a',):
                items.append('- ' + self.inline_el(k))
            elif k.tag == 'page' and k.get('href'):
                r = resolve_href(k.get('href'), self.rel)
                t = text_of(k)
                items.append('- ' + (self.wl(r[1], t) if r and r[0] == 'wiki' else t))
        return '\n'.join(items)

    def listing(self, c, ordered):
        out = []
        for i, li in enumerate([k for k in c if k.tag == 'li'], 1):
            body = self.blocks(li, 6) or ''
            marker = f'{i}.' if ordered else '-'
            pad = ' ' * (len(marker) + 1)
            lines = body.split('\n')
            out.append(f'{marker} {lines[0]}' + ''.join(f'\n{pad}{x}' if x else '\n' for x in lines[1:]))
        return '\n'.join(out)

    def tablemd(self, c):
        self.table += 1
        rows = []
        for tr in c.iter('tr'):
            cells = []
            for td in tr:
                if td.tag not in ('td', 'th'):
                    continue
                v = re.sub(r'(?<!\\)\|', r'\\|', norm_ws(self.blocks(td, 6)).replace('\n', ' '))
                cells.append(v.strip() or ' ')
                for _ in range(int(td.get('colspan', '1')) - 1):
                    cells.append(' ')
            if cells:
                rows.append(cells)
        self.table -= 1
        if not rows:
            return ''
        n = max(len(r) for r in rows)
        rows = [r + [' '] * (n - len(r)) for r in rows]
        has_th = any(k.tag == 'th' for k in next(c.iter('tr'), []))
        head = rows[0] if has_th else [' '] * n
        body = rows[1:] if has_th else rows
        lines = ['| ' + ' | '.join(head) + ' |', '| ' + ' | '.join(['---'] * n) + ' |']
        lines += ['| ' + ' | '.join(r) + ' |' for r in body]
        return '\n'.join(lines)

    def example(self, c):
        parts = []
        t = c.find('title')
        if t is not None:
            parts.append(f'**{norm_ws(self.inline(t))}**')
        hl = [k for k in c if k.tag == 'highlight']
        rest_text = (c.text or '') + ''.join((self.inline(k, code=True) if k.tag not in ('title', 'highlight') else '') + (k.tail or '') for k in c)
        for k in hl:
            parts.append(self.code(k))
        if rest_text.strip():
            parts.append(fence(dedent_code(rest_text), ''))
        return '\n\n'.join(parts)

    def code(self, c):
        lang = LANGS.get((c.get('language') or '').lower(), '')
        return fence(dedent_code(self.inline(c, code=True)), lang)


BLOCK = {'p', 'section', 'example', 'pre', 'highlight', 'note', 'blockquote', 'ul', 'ol', 'dl', 'table', 'indent', 'title', 'directivelist', 'modulelist', 'related', 'seealso'}


def esc_inline(t, code):
    if code:
        return t
    return esc_md(re.sub(r'\s+', ' ', t))


def norm_ws(t):
    lines = [re.sub(r'[ \t]+', ' ', x).strip() for x in t.split('\n')]
    t = '\n'.join(lines)
    return re.sub(r'\n{3,}', '\n\n', t).strip()


def dedent_code(t):
    lines = t.replace('\t', '    ').split('\n')
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    ind = min((len(x) - len(x.lstrip()) for x in lines if x.strip()), default=0)
    return '\n'.join(x[ind:].rstrip() for x in lines)


def fence(t, lang):
    if not t.strip():
        return ''
    f = '````' if '```' in t else '```'
    return f'{f}{lang}\n{t}\n{f}'


def quote(t):
    return '\n'.join('> ' + x if x else '>' for x in t.split('\n'))


def yaml_str(s):
    return json.dumps(s, ensure_ascii=False)


def page(title, description, tags, icon, body):
    description = re.sub(r'\s+', ' ', description).strip()
    description = re.sub(r'([^.!?:;…])( (Syntaxe|Statut), )', r'\1.\2', description)
    return f"---\ntitle: {yaml_str(title)}\ndescription: {yaml_str(description)}\ntags: [{', '.join(tags)}]\nicon: {icon}\n---\n\n{body.strip()}\n"


def write(rel, content):
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(content)


def folder(rel, title, icon, color, description):
    write(f'{rel}/_folder.json', json.dumps({'title': title, 'icon': icon, 'color': color, 'description': description}, ensure_ascii=False) + '\n')


SOURCE_NOTE = '\n\n---\n\n*Source : documentation officielle d’Apache HTTP Server {v} ({lang}), © Apache Software Foundation, licence Apache 2.0.*'


def source_note(fr):
    return SOURCE_NOTE.format(v=ENT.get('httpd.docs', '2.4'), lang='traduction française de la Fondation Apache' if fr else 'texte original en anglais, pas de traduction officielle')


EN_BANNER = '> [!NOTE]\n> Cette page n’a pas de traduction française officielle : le texte original en anglais est reproduit tel quel.\n\n'

# ------------------------------------------------------------------ génération

for d in (D_CMD, D_GUIDES, D_MODS, D_DIRS):
    shutil.rmtree(os.path.join(OUT, d), ignore_errors=True)

# Commandes
folder(D_CMD, 'Commandes', 'square-terminal', '#d22128', 'Les programmes fournis avec Apache HTTP Server : httpd, apachectl, ab, htpasswd, rotatelogs, apxs…')
n_cmd = 0
for f in sorted(os.listdir(os.path.join(SRC, 'programs'))):
    if not f.endswith('.xml') or f in ('index.xml', 'other.xml'):
        continue
    rel = f'programs/{f}'
    path, fr = localized(rel)
    root = load(path)
    name = f[:-4]
    title_full = text_of(root.find('title'))
    conv = Conv(rel)
    summary = conv.blocks(root.find('summary')) if root.find('summary') is not None else ''
    sections = '\n\n'.join(conv.block(s, 2) for s in root.findall('section'))
    see = conv.relatedlist(root.find('seealso')) if root.find('seealso') is not None else ''
    body = (EN_BANNER if not fr else '') + f'*{esc_md(title_full)}*\n\n{summary}\n\n{sections}'
    if see:
        body += f'\n\n## Voir aussi\n\n{see}'
    write(f'{D_CMD}/{name}.md', page(name, f'Commande {name} d’Apache HTTP Server — {title_full} : syntaxe, options et exemples.', ['apache', 'commande', name], 'terminal', body + source_note(fr)))
    n_cmd += 1

# Guides
folder(D_GUIDES, 'Guides', 'book-open-text', '#d22128', 'Les guides de la documentation officielle d’Apache HTTP Server 2.4, classés par thème.')
for sub, fold, title, icon, desc in GUIDE_GROUPS:
    folder(f'{D_GUIDES}/{fold}', title, icon, '#d22128', desc)
n_guides = 0
for rel, fold, fname in guides:
    path, fr = localized(rel)
    root = load(path)
    title = text_of(root.find('title'))
    assets = os.path.join(OUT, D_GUIDES, fold, '_assets')
    conv = Conv(rel, assets, '_assets')
    summary = conv.blocks(root.find('summary')) if root.find('summary') is not None else ''
    sections = '\n\n'.join(conv.block(s, 2) for s in root.findall('section'))
    see = conv.relatedlist(root.find('seealso')) if root.find('seealso') is not None else ''
    body = (EN_BANNER if not fr else '') + f'{summary}\n\n{sections}'
    if see:
        body += f'\n\n## Voir aussi\n\n{see}'
    first = re.sub(r'\[\[[^\]|]*\\?\|([^\]]*)\]\]', r'\1', summary)
    first = re.sub(r'[*`\\>#\[\]!]', '', first)
    desc = f'Apache HTTP Server — {title}. ' + ' '.join(first.split())[:240]
    write(f'{D_GUIDES}/{fold}/{fname}.md', page(title, desc, ['apache', 'guide'], 'book-open', body + source_note(fr)))
    n_guides += 1

# Modules et directives
folder(D_MODS, 'Modules', 'puzzle', '#d22128', 'Les 132 modules d’Apache HTTP Server 2.4 : rôle, statut, identifiant, fichier source et directives fournies.')
folder(D_DIRS, 'Directives', 'settings-2', '#d22128', 'Toutes les directives de configuration d’Apache HTTP Server 2.4 : syntaxe, valeur par défaut, contexte, AllowOverride, statut et module.')

LABELS = [('description', 'Description'), ('syntax', 'Syntaxe'), ('default', 'Valeur par défaut'), ('contextlist', 'Contexte'), ('override', 'AllowOverride'), ('status', 'Statut'), ('module', 'Module'), ('compatibility', 'Compatibilité')]
n_mod = n_dir = 0
for name in sorted(modules, key=str.lower):
    f = modules[name]['file']
    rel = f'mod/{f}'
    path, fr_mod = localized(rel)
    root = load(path)
    en_root = load(os.path.join(SRC, rel))
    fr_dirs = {text_of(d.find('name')).lower(): d for d in root.findall('directivesynopsis') if not d.get('location')}
    conv = Conv(rel)
    desc = text_of(root.find('description'))
    status = STATUS.get(text_of(en_root.find('status')).lower(), text_of(en_root.find('status')))
    meta = [('Description', esc_md(desc)), ('Statut', status)]
    if en_root.find('identifier') is not None:
        meta.append(('Identificateur', f"`{text_of(en_root.find('identifier'))}`"))
    if en_root.find('sourcefile') is not None:
        meta.append(('Fichier source', f"`{text_of(en_root.find('sourcefile'))}`"))
    if root.find('compatibility') is not None:
        conv.table += 1
        meta.append(('Compatibilité', norm_ws(conv.inline(root.find('compatibility'))).replace('|', '\\|')))
        conv.table -= 1
    body = '| Propriété | Valeur |\n| --- | --- |\n' + '\n'.join(f'| **{k}** | {v} |' for k, v in meta)
    if root.find('summary') is not None:
        body += '\n\n## Sommaire\n\n' + conv.blocks(root.find('summary'), 3)
    for s in root.findall('section'):
        body += '\n\n' + conv.block(s, 2)
    own, refs = [], []
    for d in en_root.findall('directivesynopsis'):
        dn = text_of(d.find('name'))
        info = dget(dn, d.get('location') or name)
        if not info:
            continue
        link = conv.wl(f"{D_DIRS}/{info['slug']}", dir_label(info['name'], info['section']))
        (refs if d.get('location') else own).append(f'- {link}' + (f" (définie dans {conv.wl(D_MODS + '/' + info['module'], info['module'])})" if d.get('location') else ''))
    if own or refs:
        body += '\n\n## Directives\n\n' + '\n'.join(own + refs)
    see = conv.relatedlist(root.find('seealso')) if root.find('seealso') is not None else ''
    if see:
        body += f'\n\n## Voir aussi\n\n{see}'
    write(f'{D_MODS}/{name}.md', page(name, f'Module Apache {name} — {desc} Statut, identifiant, fichier source, fonctionnement et liste des directives.', ['apache', 'module', name], 'puzzle', body + source_note(fr_mod)))
    n_mod += 1

    # Directives définies par ce module
    for d in en_root.findall('directivesynopsis'):
        if d.get('location'):
            continue
        dn = text_of(d.find('name'))
        info = variants[dn.lower()][name]
        src = fr_dirs.get(dn.lower())
        fr = src is not None
        src = src if fr else d
        conv = Conv(rel)
        conv.table += 1
        rows = []
        for key, label in LABELS:
            if key == 'module':
                rows.append((label, conv.wl(f'{D_MODS}/{name}', name)))
                continue
            if key == 'status':
                rows.append((label, status))
                continue
            el = src.find(key) if src.find(key) is not None else d.find(key)
            if el is None:
                continue
            if key == 'contextlist':
                v = ', '.join(CONTEXTS.get(text_of(x), text_of(x)) for x in el.findall('context'))
            elif key in ('syntax', 'default'):
                v = '`' + text_of(el).replace('`', "'") + '`'
                v = v.replace('|', '\\|')
            else:
                v = norm_ws(conv.inline(el)).replace('\n', ' ')
                v = re.sub(r'(?<!\\)\|', '\\|', v) if '[[' not in v else v
            rows.append((label, v))
        conv.table -= 1
        label = dir_label(dn, info['section'])
        title = label if len(variants[dn.lower()]) == 1 else f'{label} ({name})'
        ddesc = text_of(src.find('description'))
        body = (EN_BANNER if not fr else '') + '| Propriété | Valeur |\n| --- | --- |\n' + '\n'.join(f'| **{k}** | {v} |' for k, v in rows)
        usage = src.find('usage')
        if usage is not None:
            body += '\n\n## Utilisation\n\n' + conv.blocks(usage, 3)
        see = conv.relatedlist(src.find('seealso')) if src.find('seealso') is not None else ''
        if see:
            body += f'\n\n## Voir aussi\n\n{see}'
        write(f"{D_DIRS}/{info['slug']}.md", page(title, f'Directive Apache {label} ({name}) — {ddesc} Syntaxe, valeur par défaut, contexte, AllowOverride et exemples.', ['apache', 'directive', name], 'settings-2', body + source_note(fr)))
        n_dir += 1

print(f'Apache {VERSION} : {n_cmd} commandes, {n_guides} guides, {n_mod} modules, {n_dir} directives')

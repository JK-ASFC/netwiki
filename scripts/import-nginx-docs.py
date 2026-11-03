#!/usr/bin/env python3
# NetWiki — import de la documentation de référence de Nginx (guides, modules, directives, variables), traduite en français.
# Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
#
# Source : documentation officielle de nginx (dépôt nginx/nginx.org, dossier xml/en/docs), licence BSD 2 clauses,
# © Igor Sysoev, © Nginx, Inc. Il n'existe pas de traduction française officielle : chaque paragraphe est traduit
# dans docs/traductions/nginx/<fichier source>.json (empreinte du texte anglais → texte français). Un paragraphe
# sans traduction (nouveau ou modifié dans la source) reste en anglais et la page le signale.
#
#   git clone --depth 1 https://github.com/nginx/nginx.org.git nginx.org
#   python3 scripts/import-nginx-docs.py nginx.org content/05-web/03-nginx            # génère les pages
#   python3 scripts/import-nginx-docs.py nginx.org content/05-web/03-nginx --manquants http/ngx_http_gzip_module.xml
#        → affiche en JSON les paragraphes à traduire de ce fichier (empreinte → anglais)
#   python3 scripts/import-nginx-docs.py nginx.org content/05-web/03-nginx --stats      # avancement de la traduction

import hashlib
import json
import os
import re
import shutil
import sys
import unicodedata

from lxml import etree

ROOT = os.path.abspath(sys.argv[1])
OUT = os.path.abspath(sys.argv[2])
MODE = sys.argv[3] if len(sys.argv) > 3 else ''
MODE_ARGS = sys.argv[4:]
DOCS = os.path.join(ROOT, 'xml/en/docs')
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRAD = os.path.join(REPO, 'docs/traductions/nginx')

D_GUIDES, D_MODS, D_DIRS, D_VARS = '10-guides', '11-modules', '12-directives', '13-variables'

ENT = {}
for dtd in ('content.dtd', 'module.dtd', 'article.dtd'):
    p = os.path.join(ROOT, 'dtd', dtd)
    if os.path.exists(p):
        for m in re.finditer(r'<!ENTITY\s+(\w+)\s+"([^"]*)"\s*>', open(p, encoding='utf-8').read()):
            ENT.setdefault(m.group(1), m.group(2))
ENT['mdash'] = ' — '
ENT['nbsp'] = ' '

GUIDE_GROUPS = [
    ('01-introduction', 'Introduction', 'book-open', 'Installation, compilation, premiers pas, contrôle du processus, connexions, journaux, syntaxe de configuration, options de la ligne de commande, Windows, QUIC et HTTP/3.'),
    ('02-http', 'HTTP', 'globe', 'Traitement des requêtes, noms de serveurs, répartition de charge, HTTPS, réécriture, WebSocket.'),
    ('03-stream', 'Stream (TCP/UDP)', 'cable', 'Traitement des sessions TCP et UDP.'),
    ('04-njs', 'Scripts njs', 'braces', 'njs, le sous-ensemble de JavaScript intégré à nginx : installation, référence, exemples.'),
    ('05-pratiques', 'Guides pratiques', 'graduation-cap', 'Compilation sous Windows, sonde DTrace, contributions.'),
    ('06-developpement', 'Développement', 'code-xml', 'Guide du développement de modules nginx.'),
    ('07-faq', 'Questions fréquentes', 'circle-help', 'Réponses aux questions fréquentes.'),
]
GUIDE_MAP = {
    'install.xml': '01-introduction', 'configure.xml': '01-introduction', 'beginners_guide.xml': '01-introduction', 'control.xml': '01-introduction',
    'events.xml': '01-introduction', 'hash.xml': '01-introduction', 'debugging_log.xml': '01-introduction', 'syslog.xml': '01-introduction',
    'syntax.xml': '01-introduction', 'regex_captures.xml': '01-introduction', 'switches.xml': '01-introduction', 'windows.xml': '01-introduction',
    'quic.xml': '01-introduction', 'example.xml': '01-introduction', 'freebsd_tuning.xml': '01-introduction', 'sys_errlist.xml': '01-introduction',
    'http/request_processing.xml': '02-http', 'http/server_names.xml': '02-http', 'http/load_balancing.xml': '02-http',
    'http/configuring_https_servers.xml': '02-http', 'http/converting_rewrite_rules.xml': '02-http', 'http/websocket.xml': '02-http',
    'stream/stream_processing.xml': '03-stream',
    'howto_build_on_win32.xml': '05-pratiques', 'nginx_dtrace_pid_provider.xml': '05-pratiques', 'contributing_changes.xml': '05-pratiques',
    'dev/development_guide.xml': '06-developpement',
}
SKIP = {'index.xml', 'dirindex.xml', 'varindex.xml', 'welcome_nginx_facebook.xml', 'governance.xml', 'faq.xml', 'njs/changes.xml', 'http/ngx_http_api_module_head.xml'}

MOD_GROUPS = [
    ('01-coeur', 'Cœur', 'cpu', 'Module principal : processus, journal d’erreurs, événements, chargement de modules.'),
    ('02-http', 'HTTP', 'globe', 'Modules du serveur HTTP : cœur, proxy, upstream, SSL, réécriture, journaux, cache, authentification…'),
    ('03-stream', 'Stream (TCP/UDP)', 'cable', 'Modules du proxy TCP/UDP : cœur, proxy, upstream, SSL, journaux, accès…'),
    ('04-mail', 'Mail', 'mail', 'Modules du proxy de messagerie : IMAP, POP3, SMTP, SSL, authentification.'),
    ('05-autres', 'Autres modules', 'shapes', 'Modules divers : Google perftools, gestion (NGINX Plus), ACME, OpenTelemetry.'),
]


def mod_group(rel):
    if rel.startswith('http/'):
        return '02-http'
    if rel.startswith('stream/'):
        return '03-stream'
    if rel.startswith('mail/'):
        return '04-mail'
    return '01-coeur' if rel == 'ngx_core_module.xml' else '05-autres'


def slug(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')[:70] or 'page'


def load(rel):
    s = open(os.path.join(DOCS, rel), encoding='utf-8').read()
    s = re.sub(r'<!DOCTYPE[^>]*>', '', s)
    for _ in range(3):
        s = re.sub(r'&(\w+);', lambda m: ENT[m.group(1)] if m.group(1) in ENT and m.group(1) not in ('lt', 'gt', 'amp', 'quot', 'apos') else m.group(0), s)
    return etree.fromstring(s.encode())


def text_of(el):
    return re.sub(r'\s+', ' ', ''.join(el.itertext())).strip() if el is not None else ''


# ------------------------------------------------------------------ traductions

class Trad:
    """Toutes les traductions (un fichier JSON par fichier source) sont réunies : un paragraphe identique dans plusieurs
    modules (proxy, fastcgi, uwsgi, scgi, grpc…) n'est traduit qu'une fois."""

    def __init__(self):
        self.all = {}
        for dp, _, fn in os.walk(TRAD):
            for f in fn:
                if f.endswith('.json'):
                    self.all.update(json.load(open(os.path.join(dp, f), encoding='utf-8')))

    def file(self, rel):
        return self.all


TR = Trad()
ALL_SEGMENTS = {}  # fichier → {empreinte: anglais}, pour --tous


def h(text):
    return hashlib.sha1(text.encode('utf-8')).hexdigest()[:12]


def needs_tr(md):
    plain = re.sub(r'`[^`]*`', '', md)
    plain = re.sub(r'\*[\w$.:-]+\*', '', plain)
    plain = re.sub(r'\[\[[^\]|]*\\?\|', '', plain)
    plain = re.sub(r'https?://\S+', '', plain)
    return len(re.findall(r'[A-Za-z]{3,}', plain)) >= 1 and re.search(r'[A-Za-z]{2,}\s+[A-Za-z]{2,}|[A-Za-z]{4,}', plain)


# ------------------------------------------------------------------ inventaire

pages = {}  # fichier source → (cible wiki, titre anglais)
directives = {}  # (fichier, nom) → infos
dir_by_name = {}  # nom → [infos]
variables = {}  # (fichier, nom) → infos
var_by_name = {}
modules = []  # (fichier, groupe)
guides = []  # (fichier, groupe)

index = load('index.xml')
mod_files = []
for link in index.iter('link'):
    doc = link.get('doc') or ''
    if 'module' in doc and doc.endswith('.xml') and doc not in mod_files and os.path.exists(os.path.join(DOCS, doc)):
        mod_files.append(doc)

for rel in mod_files:
    root = load(rel)
    name = os.path.basename(rel)[:-4]
    grp = mod_group(rel)
    pages[rel] = (f'{D_MODS}/{grp}/{name}', name)
    modules.append((rel, grp, name))
    for d in root.iter('directive'):
        dn = d.get('name')
        info = {'name': dn, 'file': rel, 'module': name, 'el': d}
        directives[(rel, dn)] = info
        dir_by_name.setdefault(dn, []).append(info)
    for sec in root.iter('section'):
        if sec.get('id') != 'variables':
            continue
        for tn in sec.iter('tag-name'):
            vid = tn.get('id') or ''
            vn = text_of(tn)
            if not vn.startswith('$'):
                continue
            desc = tn.getnext()
            info = {'name': vn, 'id': vid, 'file': rel, 'module': name, 'desc': desc if desc is not None and desc.tag == 'tag-desc' else None}
            variables[(rel, vn)] = info
            var_by_name.setdefault(vn, []).append(info)

for infos in dir_by_name.values():
    for i in infos:
        i['slug'] = slug(i['name']) if len(infos) == 1 else f"{slug(i['name'])}-{slug(i['module'].replace('ngx_', '').replace('_module', ''))}"
        i['title'] = i['name'] if len(infos) == 1 else f"{i['name']} ({i['module']})"
for infos in var_by_name.values():
    for i in infos:
        base = slug(i['name'].lstrip('$'))
        i['slug'] = base if len(infos) == 1 else f"{base}-{slug(i['module'].replace('ngx_', '').replace('_module', ''))}"
        i['title'] = i['name'] if len(infos) == 1 else f"{i['name']} ({i['module']})"

all_xml = []
for dp, dn, fn in os.walk(DOCS):
    for f in fn:
        if f.endswith('.xml'):
            all_xml.append(os.path.relpath(os.path.join(dp, f), DOCS).replace(os.sep, '/'))
for rel in sorted(all_xml):
    if rel in SKIP or rel in pages:
        continue
    root = load(rel)
    if root.tag != 'article':
        continue
    grp = GUIDE_MAP.get(rel) or ('04-njs' if rel.startswith('njs/') else '07-faq' if rel.startswith('faq/') else None)
    if not grp:
        continue
    title = root.get('name', rel)
    fname = ('00-' if rel == 'njs/index.xml' else '') + slug(rel[:-4].split('/')[-1])
    pages[rel] = (f'{D_GUIDES}/{grp}/{fname}', title)
    guides.append((rel, grp, fname))

assert len({i['slug'] for v in dir_by_name.values() for i in v}) == len(directives)


# ------------------------------------------------------------------ conversion

def esc_md(t):
    return re.sub(r'([\\`*_\[\]<>])', r'\\\1', t)


class Conv:
    def __init__(self, rel):
        self.rel = rel
        self.table = 0
        self.tr = TR.file(rel)
        self.total = 0
        self.missing = {}

    def T(self, md):
        """Traduit un segment Markdown (paragraphe, élément de liste, titre, cellule)."""
        md = md.strip()
        if not md or not needs_tr(md):
            return md
        self.total += 1
        k = h(md)
        ALL_SEGMENTS.setdefault(self.rel, {})[k] = md
        fr = self.tr.get(k)
        if fr:
            return fr
        self.missing[k] = md
        return md

    def __del__(self):
        pass

    # ---- liens
    def wl(self, target, label):
        label = (label or target.split('/')[-1]).replace(']', ')').replace('|', '/')
        return f"[[{target}{'\\|' if self.table else '|'}{label}]]"

    def link(self, el):
        label = self.inline(el).strip()
        url, doc, lid = el.get('url'), el.get('doc'), el.get('id')
        if url:
            if not re.match(r'^[a-z]+:', url):
                from urllib.parse import urljoin
                url = urljoin('https://nginx.org/en/docs/' + os.path.dirname(self.rel) + '/', url)
            return f'[{label or url}]({url})'
        target_rel = os.path.normpath(os.path.join(os.path.dirname(self.rel), doc)).replace(os.sep, '/') if doc else self.rel
        if lid:
            d = directives.get((target_rel, lid))
            if d:
                return self.wl(f"{D_DIRS}/{d['slug']}", re.sub(r'[`*\\]', '', label) or d['name'])
            vname = '$' + lid[4:] if lid.startswith('var_') else None
            v = variables.get((target_rel, vname)) if vname else None
            if v:
                return self.wl(f"{D_VARS}/{v['slug']}", re.sub(r'[`*\\]', '', label) or v['name'])
        if target_rel in pages and (doc or not lid):
            t, title = pages[target_rel]
            return self.wl(t, re.sub(r'[`*\\]', '', label) or lid or title)
        if target_rel in pages and lid and target_rel != self.rel:
            t, title = pages[target_rel]
            return self.wl(t, re.sub(r'[`*\\]', '', label) or lid)
        return label or (f'`{lid}`' if lid else '')

    # ---- en ligne
    def inline(self, el, code=False):
        out = (el.text if code else esc_md(re.sub(r'\s+', ' ', el.text))) if el.text else ''
        for c in el:
            if not isinstance(c.tag, str):
                pass
            elif c.tag in BLOCK:
                pass  # traité par blocks()
            else:
                out += self.inline_el(c, code)
            if c.tail:
                out += c.tail if code else esc_md(re.sub(r'\s+', ' ', c.tail))
        return out

    def inline_el(self, c, code=False):
        tag = c.tag
        raw = lambda: re.sub(r'\s+', ' ', ''.join(c.itertext()))
        if code:
            return '\n' if tag == 'br' else ''.join(c.itertext())
        if tag in ('literal', 'path', 'command', 'c-def', 'c-func', 'header', 'var'):
            inner = raw().strip()
            if not inner:
                return ''
            return f'`{inner}`' if '`' not in inner else esc_md(inner)
        if tag == 'value':
            inner = raw().strip()
            return f'*{esc_md(inner)}*' if inner else ''
        if tag in ('emphasis', 'i'):
            inner = self.inline(c).strip()
            return f'*{inner}*' if inner else ''
        if tag == 'b':
            inner = self.inline(c).strip()
            return f'**{inner}**' if inner else ''
        if tag == 'link':
            return self.link(c)
        if tag == 'http-status':
            return f"`{c.get('code')} {c.get('text')}`"
        if tag == 'br':
            return ' ' if self.table else '  \n'
        if tag == 'commercial_version':
            return '[abonnement commercial](https://nginx.com/products/)'
        if tag == 'nobr':
            return self.inline(c)
        return self.inline(c)

    # ---- blocs
    def blocks(self, el, level=2):
        parts = []
        buf = esc_md(re.sub(r'\s+', ' ', el.text)) if el.text and el.text.strip() else ''

        def flush():
            nonlocal buf
            if buf.strip():
                parts.append(self.T(norm_ws(buf)))
            buf = ''

        for c in el:
            if not isinstance(c.tag, str) or c.tag in META:
                pass
            elif c.tag in BLOCK:
                flush()
                b = self.block(c, level)
                if b and b.strip():
                    parts.append(b)
            else:
                buf += self.inline_el(c)
            if c.tail:
                buf += esc_md(re.sub(r'\s+', ' ', c.tail)) if c.tail.strip() else (' ' if buf else '')
        flush()
        return '\n\n'.join(parts)

    def block(self, c, level):
        tag = c.tag
        if tag in ('para', 'listitem', 'tag-desc'):
            return self.blocks(c, level)
        if tag == 'section':
            name = c.get('name')
            head = f"{'#' * min(level, 6)} {self.T(esc_md(name))}" if name else ''
            body = self.blocks(c, level + 1)
            return f'{head}\n\n{body}' if head else body
        if tag == 'example':
            return fence(dedent(self.inline(c, code=True)), 'nginx')
        if tag == 'programlisting':
            txt = dedent(self.inline(c, code=True))
            lang = 'c' if re.search(r';\s*$|\{|\}|#include|ngx_', txt, re.M) and not re.search(r'^\s*(server|location|http)\s', txt, re.M) else 'texte'
            return fence(txt, lang if lang != 'texte' else '')
        if tag == 'note':
            return quote('[!NOTE]\n' + self.blocks(c, level + 1))
        if tag == 'list':
            return self.listing(c, level)
        if tag == 'table':
            return self.tablemd(c)
        if tag == 'directive':
            return ''
        return self.blocks(c, level)

    def listing(self, c, level):
        kind = c.get('type', 'bullet')
        out = []
        if kind == 'tag':
            items = [k for k in c if isinstance(k.tag, str)]
            i = 0
            while i < len(items):
                k = items[i]
                if k.tag == 'tag-name':
                    names = [k]
                    while i + 1 < len(items) and items[i + 1].tag == 'tag-name':
                        i += 1
                        names.append(items[i])
                    term = ', '.join(norm_ws(self.inline(n)) for n in names)
                    desc = ''
                    if i + 1 < len(items) and items[i + 1].tag == 'tag-desc':
                        i += 1
                        desc = self.blocks(items[i], level + 1)
                    term = self.T(term)
                    entry = f'- **{term.replace("**", "")}**' if term else '-'
                    if desc:
                        entry += '\n\n' + indent(desc, '  ')
                    out.append(entry)
                i += 1
            return '\n\n'.join(out)
        n = 0
        for k in c:
            if not isinstance(k.tag, str) or k.tag != 'listitem':
                continue
            n += 1
            body = self.blocks(k, level + 1) or ''
            marker = f'{n}.' if kind == 'enum' else '-'
            pad = ' ' * (len(marker) + 1)
            lines = body.split('\n')
            out.append(f'{marker} {lines[0]}' + ''.join(f'\n{pad}{x}' if x else '\n' for x in lines[1:]))
        sep = '\n\n' if c.get('compact') == 'no' else '\n'
        return sep.join(out)

    def tablemd(self, c):
        self.table += 1
        rows = []
        for tr in c.iter('tr'):
            cells = [re.sub(r'(?<!\\)\|', r'\\|', self.blocks(td, 6).replace('\n', ' ')).strip() or ' ' for td in tr if td.tag == 'td']
            if cells:
                rows.append(cells)
        self.table -= 1
        if not rows:
            return ''
        n = max(len(r) for r in rows)
        rows = [r + [' '] * (n - len(r)) for r in rows]
        lines = ['| ' + ' | '.join([' '] * n) + ' |', '| ' + ' | '.join(['---'] * n) + ' |'] + ['| ' + ' | '.join(r) + ' |' for r in rows]
        return '\n'.join(lines)


META = {'syntax', 'default', 'context', 'appeared-in'}
BLOCK = {'para', 'section', 'example', 'programlisting', 'note', 'list', 'listitem', 'table', 'tag-desc', 'directive'}


def norm_ws(t):
    lines = [re.sub(r'[ \t]+', ' ', x).strip() for x in t.split('\n')]
    return re.sub(r'\n{3,}', '\n\n', '\n'.join(lines)).strip()


def dedent(t):
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


def indent(t, pad):
    return '\n'.join(pad + x if x else '' for x in t.split('\n'))


def yaml_str(s):
    return json.dumps(s, ensure_ascii=False)


def plain(md, n=220):
    t = re.sub(r'\[\[[^\]|]*\\?\|([^\]]*)\]\]', r'\1', md)
    t = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', t)
    t = re.sub(r'[*`\\>#\[\]!]', '', t)
    t = ' '.join(t.split())
    return t if len(t) <= n else t[:n].rsplit(' ', 1)[0] + '…'


SOURCE = '\n\n---\n\n*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*'
PARTIAL = '> [!NOTE]\n> Traduction en cours : les passages encore en anglais seront traduits prochainement.\n\n'


def page(title, description, tags, icon, body, conv):
    banner = PARTIAL if conv.missing else ''
    description = ' '.join(description.split())
    return f"---\ntitle: {yaml_str(title)}\ndescription: {yaml_str(description)}\ntags: [{', '.join(tags)}]\nicon: {icon}\n---\n\n{banner}{body.strip()}{SOURCE}\n"


def write(rel, content):
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(content)


def folder(rel, title, icon, color, description):
    write(f'{rel}/_folder.json', json.dumps({'title': title, 'icon': icon, 'color': color, 'description': description}, ensure_ascii=False) + '\n')


CONTEXT_FR = {'if in location': 'if dans location', 'limit_except': 'limit_except'}


def directive_table(conv, d):
    el = d['el']
    rows = []
    syn = []
    for s in el.findall('syntax'):
        v = re.sub(r'\s+', ' ', ''.join(s.itertext())).strip()
        syn.append(f"`{d['name']} {v}{' { ... }' if s.get('block') == 'yes' else ';'}`".replace(' ;', ';').replace('  ', ' '))
    rows.append(('Syntaxe', ' ou '.join(syn).replace('|', '\\|')))
    de = el.find('default')
    dv = text_of(de) if de is not None else ''
    rows.append(('Valeur par défaut', f"`{d['name']} {dv};`".replace('|', '\\|') if dv else '—'))
    rows.append(('Contexte', ', '.join(f'`{CONTEXT_FR.get(text_of(x), text_of(x))}`' for x in el.findall('context'))))
    ap = [text_of(x) for x in el.findall('appeared-in')]
    if ap:
        rows.append(('Apparue dans la version', ', '.join(ap)))
    conv.table += 1
    rows.append(('Module', conv.wl(pages[d['file']][0], d['module'])))
    conv.table -= 1
    return '| Propriété | Valeur |\n| --- | --- |\n' + '\n'.join(f'| **{k}** | {v} |' for k, v in rows)


# ------------------------------------------------------------------ génération

def generate():
    missing_total = {}
    stats = {'segments': 0, 'manquants': 0}
    for d in (D_GUIDES, D_MODS, D_DIRS, D_VARS):
        shutil.rmtree(os.path.join(OUT, d), ignore_errors=True)
    folder(D_GUIDES, 'Guides', 'book-open-text', '#009639', 'Les guides de la documentation officielle de nginx, traduits en français et classés par thème.')
    for g, t, i, desc in GUIDE_GROUPS:
        folder(f'{D_GUIDES}/{g}', t, i, '#009639', desc)
    folder(D_MODS, 'Modules', 'puzzle', '#009639', 'Les modules de nginx (cœur, HTTP, stream, mail) : rôle, exemple de configuration, directives et variables.')
    for g, t, i, desc in MOD_GROUPS:
        folder(f'{D_MODS}/{g}', t, i, '#009639', desc)
    folder(D_DIRS, 'Directives', 'settings-2', '#009639', 'Toutes les directives de configuration de nginx : syntaxe, valeur par défaut, contexte, version d’apparition, module et explications.')
    folder(D_VARS, 'Variables', 'dollar-sign', '#009639', 'Les variables intégrées de nginx ($remote_addr, $request_uri, $upstream_status…) et leur module.')

    def account(conv):
        stats['segments'] += conv.total
        stats['manquants'] += len(conv.missing)
        missing_total.setdefault(conv.rel, {}).update(conv.missing)

    # Guides
    for rel, grp, fname in guides:
        root = load(rel)
        conv = Conv(rel)
        title_en = root.get('name')
        title = conv.T(esc_md(title_en)).replace('\\', '')
        body = '\n\n'.join(conv.block(s, 2) for s in root if isinstance(s.tag, str) and s.tag == 'section')
        first = next((p for p in body.split('\n\n') if p and not p.startswith(('#', '>', '`', '|', '-'))), '')
        account(conv)
        write(f'{D_GUIDES}/{grp}/{fname}.md', page(title, f'Nginx — {title}. {plain(first)}', ['nginx', 'guide'], 'book-open', body, conv))

    # Modules, directives, variables
    for rel, grp, name in modules:
        root = load(rel)
        conv = Conv(rel)
        parts = []
        dir_list = []
        for sec in root:
            if not isinstance(sec.tag, str) or sec.tag != 'section':
                continue
            if sec.get('id') == 'directives':
                for d in sec.iter('directive'):
                    info = directives[(rel, d.get('name'))]
                    dir_list.append(f"- {conv.wl(D_DIRS + '/' + info['slug'], info['name'])}")
                continue
            if sec.get('id') == 'variables':
                head = '## Variables intégrées'
                items = [f"- {conv.wl(D_VARS + '/' + v['slug'], v['name'])}" for (r, _), v in variables.items() if r == rel]
                intro = conv.blocks(sec, 3)
                parts.append(f'{head}\n\n' + '\n'.join(items) + (f'\n\n{intro}' if intro and False else ''))
                continue
            parts.append(conv.block(sec, 2))
        if dir_list:
            idx = next((i for i, p in enumerate(parts) if p.startswith('## ') and 'Variables' in p[:40]), len(parts))
            parts.insert(idx, '## Directives\n\n' + '\n'.join(dir_list))
        body = '\n\n'.join(p for p in parts if p.strip())
        first = next((p for p in body.split('\n\n') if p and not p.startswith(('#', '>', '`', '|', '-'))), '')
        account(conv)
        write(f'{D_MODS}/{grp}/{name}.md', page(name, f'Module nginx {name} — {plain(first)}', ['nginx', 'module', name], 'puzzle', body, conv))

        for d in root.iter('directive'):
            info = directives[(rel, d.get('name'))]
            dconv = Conv(rel)
            body = directive_table(dconv, info)
            text = dconv.blocks(d, 2)
            if text:
                body += '\n\n## Utilisation\n\n' + text
            account(dconv)
            write(f"{D_DIRS}/{info['slug']}.md", page(info['title'], f"Directive nginx {info['name']} ({name}) — {plain(text, 200)}", ['nginx', 'directive', name], 'settings-2', body, dconv))

        for (r, vn), v in variables.items():
            if r != rel:
                continue
            vconv = Conv(rel)
            desc = vconv.blocks(v['desc'], 2) if v['desc'] is not None else ''
            vconv.table += 1
            table = f"| Propriété | Valeur |\n| --- | --- |\n| **Variable** | `{vn}` |\n| **Module** | {vconv.wl(pages[rel][0], name)} |"
            vconv.table -= 1
            account(vconv)
            write(f"{D_VARS}/{v['slug']}.md", page(v['title'], f'Variable nginx {vn} ({name}) — {plain(desc, 200)}', ['nginx', 'variable', name], 'dollar-sign', f'{table}\n\n{desc}', vconv))
    return stats, missing_total


stats, missing = generate()
if MODE == '--manquants':
    out, seen = {}, set()
    for rel in MODE_ARGS:
        segs = {k: v for k, v in missing.get(rel, {}).items() if k not in seen}
        seen.update(segs)
        if segs:
            out[rel] = segs
    print(json.dumps(out, ensure_ascii=False, indent=0))
elif MODE == '--tous':
    print(json.dumps(ALL_SEGMENTS, ensure_ascii=False))
elif MODE == '--stats':
    for rel in sorted(missing, key=lambda r: -len(missing[r])):
        if missing[rel]:
            print(f'{len(missing[rel]):5d}  {rel}')
    print(f"Traduits : {stats['segments'] - stats['manquants']} / {stats['segments']} segments")
else:
    print(f"nginx : {len(guides)} guides, {len(modules)} modules, {len(directives)} directives, {len(variables)} variables ; "
          f"traduction {stats['segments'] - stats['manquants']}/{stats['segments']} segments")

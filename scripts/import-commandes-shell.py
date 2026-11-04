#!/usr/bin/env python3
"""Génère la référence des commandes Bash, PowerShell et macOS de NetWiki.

Source : le fichier HTML autonome « X DIAG » (Command Deck v3), dont le script
contient la base RAW (une ligne = une commande, 7 champs séparés par « ¦ ») et
le dictionnaire DETAIL (explications détaillées).

Usage :
    python3 -I scripts/import-commandes-shell.py <X-DIAG.html> content/27-commandes [--wiki content]

Arborescence produite :
    27-commandes/
      01-presentation.md
      01-bash/       <NN-categorie>/<commande>.md
      02-powershell/ <NN-categorie>/<commande>.md
      03-macos/      <NN-categorie>/<commande>.md

Les textes de la source sont parfois écrits sans accents : ils sont restaurés
à partir du vocabulaire du wiki (option --wiki), jamais dans les commandes.
"""
import collections
import json
import pathlib
import re
import shutil
import sys
import unicodedata

SHELLS = [
    # clé source, dossier, titre, libellé court, langage de code, icône, couleur
    ('bash', '01-bash', 'Bash (Linux)', 'Bash', 'bash', 'terminal', '#22c55e'),
    ('powershell', '02-powershell', 'PowerShell (Windows)', 'PowerShell', 'powershell', 'square-terminal', '#3b82f6'),
    ('mac', '03-macos', 'macOS (zsh)', 'macOS', 'zsh', 'laptop', '#a855f7'),
]
SOURCE = ('*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki '
          '(accents restaurés, mise en forme).*')

# ---------------------------------------------------------------- extraction

def extract(html_path):
    html = unicodedata.normalize('NFC', pathlib.Path(html_path).read_text(encoding='utf-8'))
    m = re.search(r'<script[^>]*>(.*?)</script>', html, flags=re.S)
    if not m:
        sys.exit('script introuvable dans le HTML')
    js = m.group(1)
    raw = js[js.find('const RAW'):js.find('const DETAIL')]
    starts = [(mm.group(1), mm.start()) for mm in re.finditer(r'^  ([a-z]+): \{\s*\n\s*prompt:', raw, flags=re.M)]
    shells = {}
    for i, (name, a) in enumerate(starts):
        b = starts[i + 1][1] if i + 1 < len(starts) else len(raw)
        cats = collections.OrderedDict()
        for c in re.finditer(r'^"([^"]+)": String\.raw`(.*?)`', raw[a:b], flags=re.M | re.S):
            rows = [l.split('¦') for l in c.group(2).strip('\n').split('\n') if l.strip()]
            bad = [r for r in rows if len(r) != 7]
            if bad:
                sys.exit(f'{name}/{c.group(1)} : ligne mal formée {bad[0][:2]}')
            cats[c.group(1)] = rows
        shells[name] = cats
    dm = re.search(r'const DETAIL=(\{.*?\});\s*\n', js, flags=re.S)
    detail = json.loads(dm.group(1)) if dm else {}
    return shells, detail

# ---------------------------------------------------------------- accents

def fold(w):
    return ''.join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn')

NO_FIX = {'a', 'ou', 'la', 'des', 'du', 'sur', 'mur', 'mais', 'peche', 'foret', 'eleve', 'interesse'}
A_LOC = {'la', 'l', 'partir', 'chaque', 'chaud', 'jour', 'distance', 'droite', 'gauche', 'travers', 'nouveau',
         'tous', 'toutes', 'part', 'moins', 'condition', 'cause', 'quel', 'quelle', 'root', 'zero', 'zéro'}
VERB_PREV = {'qui', 'il', 'elle', 'on', 'y', 'ce', 'cela', 'ça', 'ne', 'n', 'ip', 'chacun', 'personne', 'quoi', 'tout'}
VERB_NEXT = {'été', 'ete', 'besoin', 'pas', 'déjà', 'deja', 'lieu', 'plus', 'toujours', 'jamais', 'bien', 'le', 'les',
             'reçu', 'recu', 'droit', 'raison', 'tort', 'accès'}
# mots absents du vocabulaire du wiki
EXTRA = {'lineaire': 'linéaire', 'reflexe': 'réflexe', 'edite': 'édite', 'detache': 'détaché', 'detaches': 'détachés',
         'inutilise': 'inutilisé', 'inutilises': 'inutilisés', 'fusionnee': 'fusionnée', 'desindexe': 'désindexe',
         'desindexer': 'désindexer', 'managee': 'managée', 'incrementiel': 'incrémentiel', 'resistance': 'résistance',
         'definition': 'définition', 'definitions': 'définitions'}
AUX = {'est', 'sont', 'été', 'être', 'etre', 'a', 'ont', 'était', 'étaient', 'reste', 'restent', 'devient',
       'deviennent', 'déjà', 'deja', 'bien', 'mal', 'non', 'jamais', 'pas'}


class Accents:
    def __init__(self, wiki_dir):
        self.cnt = collections.Counter()
        self.best = {}
        if not wiki_dir:
            return
        for p in pathlib.Path(wiki_dir).rglob('*.md'):
            if '27-commandes' in p.parts:
                continue
            t = unicodedata.normalize('NFC', p.read_text(encoding='utf-8'))
            t = re.sub(r'^---\n.*?\n---\n', '', t, flags=re.S)          # en-tête YAML
            t = re.sub(r'```.*?```', '', t, flags=re.S)
            t = re.sub(r'\[\[[^\]|]*\|', '[[', t)                       # cibles des liens internes
            t = re.sub(r'\[\[[^\]]*\]\]', '', t)
            t = re.sub(r'\]\([^)]*\)', ']', t)                          # URL des liens
            t = re.sub(r'`[^`]*`', '', t)
            for w in re.findall(r'[A-Za-zÀ-ÿœŒ]+', t):
                self.cnt[w.lower()] += 1
        self.variants = collections.defaultdict(list)
        for w, c in self.cnt.items():
            f = fold(w)
            self.variants[f].append(w)
            if f != w and (f not in self.best or c > self.cnt[self.best[f]]):
                self.best[f] = w

    def word(self, w, prev):
        lw = w.lower()
        if lw != fold(lw):                       # accents partiels (« sécurite ») : forme la plus courante du wiki
            b = self.best.get(fold(lw))
            if b and b != lw and self.cnt.get(lw, 0) == 0 and self.cnt[b] >= 3:
                return b.upper() if w.isupper() and len(w) > 1 else (b[0].upper() + b[1:] if w[0].isupper() else b)
            return w
        if lw in EXTRA:
            acc = EXTRA[lw]
            return acc.upper() if w.isupper() and len(w) > 1 else (acc[0].upper() + acc[1:] if w[0].isupper() else acc)
        if lw in NO_FIX or lw not in self.best:
            return w
        acc = self.best[lw]
        aux = (prev or '').lower() in AUX
        if aux and lw.endswith('e'):                   # « déjà créé », « a modifié »
            parts = [v for v in self.variants.get(lw, ()) if v.endswith('é')]
            if parts:
                acc = max(parts, key=lambda v: self.cnt[v])
        if aux and lw.endswith('e') and acc.endswith('é') and self.cnt[acc] >= 3:
            pass                                        # participe après un auxiliaire : « a modifié »
        elif self.cnt[acc] < 3 or self.cnt.get(lw, 0) * 4 > self.cnt[acc]:
            return w
        # verbe (« Renomme ») ou participe (« renommé ») : le verbe s'il est courant, sauf après un auxiliaire
        # en tête de phrase ou après « et / qui » : verbe (« Récupère et intègre ») ; après un nom : participe
        # (« Client OpenSSH intégré », « le manuel intégré »)
        verb_ctx = prev is None or prev.lower() in ('et', 'puis', 'ou', 'qui', 'ne', 'se', 's', 'on', 'il', 'elle',
                                                    'cela', 'ça', 'puis', 'pour', 'qu')
        if lw.endswith('e') and acc.endswith('é') and not aux and verb_ctx:
            verbs = [v for v in self.variants.get(lw, ()) if v.endswith('e')]
            verb = max(verbs, key=lambda v: self.cnt[v]) if verbs else acc[:-1] + 'e'
            if self.cnt.get(verb, 0) * 10 >= self.cnt[acc]:
                acc = verb
        if w.isupper() and len(w) > 1:
            return acc.upper()
        if w[0].isupper():
            return acc[0].upper() + acc[1:]
        return acc

    def text(self, s):
        out, prev = [], None
        for tok in re.split(r'([A-Za-zÀ-ÿœŒ]+)', s):
            if tok and re.fullmatch(r'[A-Za-zÀ-ÿœŒ]+', tok):
                out.append(self.word(tok, prev))
                prev = tok
            else:
                out.append(tok)
                if tok.strip():
                    prev = None
        # « a » préposition (« à ») sauf quand c'est le verbe avoir (« qui a », « y a », « a été », « a modifié »)
        words = [i for i, t in enumerate(out) if re.fullmatch(r'[A-Za-zÀ-ÿœŒ]+', t or '')]
        for n, i in enumerate(words):
            if out[i] not in ('a', 'A'):
                continue
            before = out[i - 1] if i > 0 else ''
            if before[-1:] in ('-', '/', '.', '`', '$', '%', '=', '_'):      # option « -a », chemin, variable
                continue
            prev_w = out[words[n - 1]].lower() if n > 0 else ''
            next_w = out[words[n + 1]].lower() if n + 1 < len(words) else ''
            between = ''.join(out[i + 1:words[n + 1]]) if n + 1 < len(words) else ''
            if between.strip() not in ('', '-', '--') or prev_w in VERB_PREV or next_w in VERB_NEXT:
                continue
            if re.fullmatch(r'[a-zà-ÿœ]{2,}(é|és|ée|ées)', next_w):
                continue
            out[i] = 'à' if out[i] == 'a' else 'À'
        res = ''.join(out)
        res = re.sub(r'côte [aà] côt[eé]', 'côte à côte', res)
        res = res.replace('attache/détaché', 'attache/détache')
        return res
        return ''.join(out)

# ---------------------------------------------------------------- helpers

CAT_FIX = {'Reseau': 'Réseau', 'Securite & acces': 'Sécurité & accès', 'Systeme': 'Système',
           'Comptes & securite': 'Comptes & sécurité', 'Journaux & evenements': 'Journaux & événements',
           'Services & taches': 'Services & tâches'}

CAT_ICON = {
    'ansible': 'workflow', 'apache': 'globe', 'archivage': 'archive', 'automatisation': 'workflow',
    'comptes': 'users', 'disques': 'hard-drive', 'docker': 'boxes', 'environnement': 'settings',
    'fichiers': 'file-code', 'git': 'git-branch', 'heredoc': 'code', 'kubernetes': 'layers',
    'mysql': 'database', 'navigation': 'folder', 'pagers': 'book-open', 'paquets': 'package-search',
    'php': 'code', 'processus': 'activity', 'recherche': 'scan-search', 'réseau': 'network',
    'sécurité': 'shield', 'ssh': 'key-round', 'système': 'server', 'terraform': 'layers',
    'virtualisation': 'server-cog', 'azure': 'globe', 'vpn': 'lock', 'active': 'users',
    'gpo': 'settings', 'journaux': 'scroll-text', 'pare-feu': 'shield', 'registre': 'database',
    'remoting': 'plug', 'services': 'settings', 'windows': 'server',
}


def slug(s, ctx=''):
    if not re.search(r'[A-Za-z0-9]', fold(s)) and ctx:
        s = ctx
    s = fold(s).lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s or 'commande'


def sort_key(s):
    return fold(s).lower()


def q(s):
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'


def cell(s):
    return s.replace('|', '\\|').replace('\n', ' ')


def code_inline(s):
    if '`' in s:
        return '`` ' + s + ' ``'
    return '`' + s + '`'


def items(field):
    out = []
    for it in field.split('‖'):
        it = it.strip()
        if not it:
            continue
        if '→' in it:
            a, b = it.split('→', 1)
        else:
            a, b = it, ''
        out.append((a.strip(), b.strip()))
    return out


def cat_icon(cat):
    first = fold(cat.split()[0]).lower()
    for k, v in CAT_ICON.items():
        if fold(k) == first:
            return v
    return 'terminal'

# ---------------------------------------------------------------- génération

def build(shells, detail, out, acc):
    out = pathlib.Path(out)
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    (out / '_folder.json').write_text(json.dumps({
        'title': 'Commandes Bash, PowerShell & macOS', 'icon': 'terminal', 'color': '#10b981',
        'description': 'Référence des commandes en ligne de commande, prêtes à copier : Bash (Linux), PowerShell '
                       '(Windows) et macOS (zsh), classées par thème, avec options, options dangereuses et exemples.'},
        ensure_ascii=False) + '\n', encoding='utf-8')

    # index nom -> chemins pour les renvois entre shells
    where = collections.defaultdict(list)
    plan = []
    stats = {}
    for key, folder, title, short, lang, icon, color in SHELLS:
        cats = shells[key]
        names = sorted(cats, key=lambda c: sort_key(CAT_FIX.get(c, c)))
        catplan = []
        total = 0
        for i, c in enumerate(names, 1):
            ctitle = acc.text(CAT_FIX.get(c, c))
            cdir = f'{i:02d}-{slug(ctitle)}'
            used = collections.Counter()
            rows = []
            for r in cats[c]:
                s = slug(r[0], r[1])
                used[s] += 1
                if used[s] > 1:
                    s = f'{s}-{used[s]}'
                rows.append((s, r))
                where[r[0].lower()].append((key, short, f'{folder}/{cdir}/{s}'))
            catplan.append((ctitle, cdir, rows))
            total += len(rows)
        plan.append((key, folder, title, short, lang, icon, color, catplan))
        stats[key] = (len(catplan), total)

    for key, folder, title, short, lang, icon, color, catplan in plan:
        sdir = out / folder
        sdir.mkdir()
        (sdir / '_folder.json').write_text(json.dumps({
            'title': title, 'icon': icon, 'color': color,
            'description': f'{stats[key][1]} commandes {short} en {stats[key][0]} catégories : syntaxe type, '
                           'options, options dangereuses et exemples prêts à copier.'}, ensure_ascii=False) + '\n',
            encoding='utf-8')
        for ctitle, cdir, rows in catplan:
            cd = sdir / cdir
            cd.mkdir()
            (cd / '_folder.json').write_text(json.dumps({
                'title': ctitle, 'icon': cat_icon(ctitle), 'color': color,
                'description': f'{short} — {ctitle} : ' + ', '.join(r[0] for _, r in rows[:12])
                               + ('…' if len(rows) > 12 else '')}, ensure_ascii=False) + '\n', encoding='utf-8')
            for s, r in rows:
                page = render(r, key, short, lang, ctitle, detail, where, acc, f'{folder}/{cdir}/{s}')
                (cd / f'{s}.md').write_text(page, encoding='utf-8')

    (out / '01-presentation.md').write_text(presentation(plan, stats), encoding='utf-8')
    return stats


def render(r, key, short, lang, ctitle, detail, where, acc, selfpath):
    name, ctx, cmd, desc, kw, flags, examples = [x.strip() for x in r]
    ctx_f = acc.text(ctx)
    desc_f = acc.text(desc)
    head = name if name else cmd
    lines = ['---',
             f'title: {q(head)}',
             f'description: {q(f"{short} — {head} ({ctx_f}) : {desc_f}")}',
             f'tags: [{", ".join(dict.fromkeys([slug(short), "commande", slug(ctitle)]))}]',
             'icon: terminal',
             '---', '',
             '| Propriété | Valeur |', '| --- | --- |',
             f'| **Shell** | {short} |',
             f'| **Catégorie** | {cell(ctitle)} |',
             f'| **Contexte** | {cell(ctx_f)} |',
             f'| **Commande type** | {cell(code_inline(cmd))} |', '',
             '## Rôle', '', desc_f, '']
    det = detail.get(name) or detail.get(name.lower())
    if det:
        lines += ['## En détail', '', acc.text(det), '']

    opts = items(flags)
    if opts:
        seen = {}
        for a, b in opts:
            k = a.lstrip('!')
            if k in seen and len(b) <= len(seen[k][1]):
                continue
            seen[k] = (a, b)
        danger = [(a.lstrip('!'), b) for a, b in seen.values() if a.startswith('!')]
        lines += ['## Options', '', '| Option | Rôle |', '| --- | --- |']
        for a, b in seen.values():
            mark = '⚠️ ' if a.startswith('!') else ''
            lines.append(f'| {mark}{cell(code_inline(a.lstrip("!")))} | {cell(acc.text(b))} |')
        lines.append('')
        if danger:
            lines += ['> [!WARNING]',
                      '> Options à manier avec précaution : ' + ', '.join(code_inline(a) for a, _ in danger)
                      + '. Elles contournent une protection, détruisent des données ou agissent sans confirmation.', '']

    exs = items(examples)
    if exs:
        lines += ['## Exemples', '']
        for a, b in exs:
            label, code = (a, b) if b else ('', a)
            if label:
                lines += [f'**{acc.text(label)}**', '']
            lines += [f'```{lang}', code, '```', '']

    others = [w for w in where.get(name.lower(), []) if w[2] != selfpath]
    if others:
        lines += ['## Dans les autres shells', '']
        for k, sh, path in others:
            lines.append(f'- [[27-commandes/{path}|{name} ({sh})]]')
        lines.append('')

    if kw.strip():
        lines += [f'*Mots-clés : {acc.text(kw.strip())}*', '']
    lines += ['---', '', SOURCE, '']
    return '\n'.join(lines)


def presentation(plan, stats):
    total = sum(v[1] for v in stats.values())
    L = ['---',
         'title: Référence des commandes Bash, PowerShell et macOS',
         f'description: "Présentation de la référence : {total} commandes en ligne de commande pour Linux (Bash), '
         'Windows (PowerShell) et macOS (zsh), organisation par shell et par thème, lecture des pages, options '
         'dangereuses et conventions."',
         'tags: [commandes, bash, powershell, macos, zsh, référence]',
         'icon: terminal', '---', '',
         f'Cette référence rassemble **{total} commandes** prêtes à copier, réparties en trois shells. Chaque commande a '
         'sa page : rôle, explication détaillée quand elle existe, options, options dangereuses signalées et exemples.',
         '', '| Shell | Catégories | Commandes |', '| --- | --- | --- |']
    for key, folder, title, short, *_ , catplan in plan:
        L.append(f'| {title} | {stats[key][0]} | {stats[key][1]} |')
    L += ['', '## Lire une page', '',
          '| Section | Contenu |', '| --- | --- |',
          '| **Commande type** | La forme la plus courante, à adapter |',
          '| **Rôle** | Ce que fait la commande |',
          '| **En détail** | Explication approfondie (pour les commandes qui en ont une) |',
          '| **Options** | Options utiles ; ⚠️ signale une option dangereuse |',
          '| **Exemples** | Cas d’usage prêts à copier |',
          '| **Dans les autres shells** | La même commande côté Bash, PowerShell ou macOS |', '',
          'Les valeurs entre chevrons `‹…›` sont à remplacer (fichier, utilisateur, adresse…).', '',
          '> [!WARNING]',
          '> Lisez une commande avant de l’exécuter, surtout avec `sudo` ou en administrateur, et testez d’abord sur une '
          'machine de test. Les options marquées ⚠️ suppriment des données, désactivent une vérification ou agissent '
          'sans confirmation.', '']
    for key, folder, title, short, lang, icon, color, catplan in plan:
        L += [f'## {title}', '']
        for ctitle, cdir, rows in catplan:
            links = ', '.join(f'[[27-commandes/{folder}/{cdir}/{s}\\|{r[0]}]]' if False else
                              f'[[27-commandes/{folder}/{cdir}/{s}|{r[0]}]]' for s, r in rows)
            L.append(f'- **{ctitle}** ({len(rows)}) : {links}')
        L.append('')
    L += ['---', '', SOURCE, '']
    return '\n'.join(L)


def main():
    a = sys.argv[1:]
    if len(a) < 2:
        sys.exit(__doc__)
    wiki = None
    if '--wiki' in a:
        i = a.index('--wiki')
        wiki = a[i + 1]
        del a[i:i + 2]
    shells, detail = extract(a[0])
    acc = Accents(wiki)
    stats = build(shells, detail, a[1], acc)
    print('commandes :', ', '.join(f'{k} {v[1]} ({v[0]} catégories)' for k, v in stats.items()))


if __name__ == '__main__':
    main()

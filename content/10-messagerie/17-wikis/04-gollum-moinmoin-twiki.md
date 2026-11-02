---
title: Gollum, MoinMoin et TWiki
description: Wikis légers ou historiques — Gollum (MIT, Ruby : wiki stocké dans un dépôt Git, Markdown et autres formats ; gem install gollum, Docker gollumwiki/gollum, options de lancement), MoinMoin (GPL, Python : version 1.9 en fin de vie et Moin 2 ; pip install moin, create-instance, index-create, import19, moin run) et TWiki (GPL, Perl : wiki d'entreprise historique, successeur Foswiki), installation, usage, sauvegarde et conseils de migration.
tags: [gollum, moinmoin, twiki, foswiki, wiki, git, python, perl]
icon: book-marked
---

## Gollum

**Gollum** (MIT) affiche et modifie un wiki dont les pages sont des fichiers d'un **dépôt Git** (Markdown, AsciiDoc, reStructuredText, Org…). Chaque modification est un commit : historique, revue et sauvegarde passent par Git. C'est le moteur historique des wikis de GitHub et un bon choix pour une documentation versionnée à côté du code.

```bash
sudo apt install -y ruby-full build-essential cmake pkg-config libssl-dev libicu-dev zlib1g-dev git
sudo gem install gollum
git init /srv/wiki-infra
gollum --port 4567 --host 127.0.0.1 --allow-uploads dir --ref main /srv/wiki-infra
```

Docker (Linux, Windows et macOS) :

```bash
docker run -d --name gollum -p 127.0.0.1:4567:4567 -v /srv/wiki-infra:/wiki gollumwiki/gollum:master
```

Options utiles : `--ref` (branche), `--allow-uploads dir|page`, `--user-icons gravatar`, `--css`, `--h1-title`, `--base-path /wiki`. Gollum n'a **pas d'authentification** intégrée : le placer derrière un reverse proxy qui authentifie ([[06-authelia/01-presentation-configuration|Authelia]], [[18-oauth2-proxy-dex/01-oauth2-proxy|oauth2-proxy]]). Sauvegarde : `git push` vers un dépôt distant.

## MoinMoin

**MoinMoin** (GPL, Python) est un wiki historique (documentation de Python, d'Ubuntu, de Debian). La branche **1.9** fonctionne en Python 2, qui n'est plus maintenu : ne plus l'utiliser pour un nouveau wiki. **Moin 2** est une réécriture en Python 3 (versions en préversion), avec un outil d'import des wikis 1.9.

```bash
python3 -m venv /opt/moin && /opt/moin/bin/pip install --pre moin
/opt/moin/bin/moin create-instance --path /srv/moin/wiki-infra
cd /srv/moin/wiki-infra && nano wikiconfig.py          # nom du site, ACL, administrateurs
/opt/moin/bin/moin index-create
/opt/moin/bin/moin welcome
/opt/moin/bin/moin load-help -n help-fr
/opt/moin/bin/moin import19 -d /srv/moin19/wiki/data   # migration d'un wiki 1.9
/opt/moin/bin/moin run                                  # serveur de test ; en production : WSGI (Apache mod_wsgi, gunicorn)
```

Fonctionne aussi sous Windows et macOS (Python 3 et `pip`).

## TWiki

**TWiki** (GPL, Perl) est l'un des premiers wikis d'entreprise (applications structurées, formulaires, plugins). Le projet évolue peu ; sa branche communautaire **Foswiki** est plus active. Installation : archive `TWiki-6.x`, Apache avec CGI et Perl, puis script de configuration web `bin/configure`. Pour un nouveau besoin, préférer [[02-xwiki|XWiki]] ou Foswiki ; pour un TWiki existant, migrer vers Foswiki (compatible) ou exporter le contenu.

Commandes : [[90-aide-memoire|aide-mémoire]].

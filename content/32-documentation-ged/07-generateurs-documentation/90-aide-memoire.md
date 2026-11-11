---
title: Docusaurus, VitePress, Antora et Bookdown — aide-mémoire
description: Commandes de création, d'aperçu et de construction de Docusaurus (create-docusaurus, start, build, docs:version), VitePress (init, docs:dev, docs:build), Antora (playbook, --fetch, lunr) et Bookdown (render_book, serve_book), ports et dossiers de sortie.
tags: [aide-mémoire, docusaurus, vitepress, antora, bookdown, asciidoc]
icon: terminal
---

Explications : [[01-docusaurus-vitepress|Docusaurus et VitePress]] · [[02-antora-bookdown|Antora et Bookdown]].

| Outil | Aperçu | Sortie |
| --- | --- | --- |
| Docusaurus | `npm run start` (3000) | `build/` |
| VitePress | `npm run docs:dev` (5173) | `.vitepress/dist/` |
| Antora | serveur statique au choix | `build/site/` |
| Bookdown | `serve_book()` | `_book/` |

```bash
# Docusaurus
npx create-docusaurus@latest site classic --typescript
npm run start -- --host 127.0.0.1 ; npm run build ; npm run serve
npm run docusaurus docs:version 2.0

# VitePress
npm add -D vitepress && npx vitepress init
npm run docs:dev ; npm run docs:build ; npm run docs:preview

# Antora
npm i -D -E antora @antora/lunr-extension
npx antora antora-playbook.yml ; npx antora --fetch antora-playbook.yml

# Bookdown (depuis un terminal)
Rscript -e 'bookdown::render_book("index.Rmd", "bookdown::bs4_book")'
Rscript -e 'bookdown::render_book("index.Rmd", "bookdown::pdf_book")'

# Publication
rsync -a --delete build/ web:/var/www/doc/
```

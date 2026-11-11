---
title: Générateurs de sites statiques — aide-mémoire
description: Ports, dossiers de sortie et commandes de Hugo (new site, server, --minify), Jekyll (bundle exec), Zola (serve, build, check), Astro (create, dev, build, add) et Quartz (create, build --serve, sync).
tags: [aide-mémoire, hugo, jekyll, zola, astro, quartz]
icon: terminal
---

Explications : [[01-hugo-jekyll-zola|Hugo, Jekyll et Zola]] · [[02-astro-quartz|Astro et Quartz]].

| Outil | Aperçu | Sortie |
| --- | --- | --- |
| Hugo | 1313 | `public/` |
| Jekyll | 4000 | `_site/` |
| Zola | 1111 | `public/` |
| Astro | 4321 | `dist/` |
| Quartz | 8080 | `public/` |

```bash
# Hugo
hugo new site s ; hugo new content articles/a.md
hugo server --bind 127.0.0.1 --buildDrafts ; hugo --minify ; hugo version

# Jekyll
bundle exec jekyll serve --host 127.0.0.1 --livereload
JEKYLL_ENV=production bundle exec jekyll build

# Zola
zola init s ; zola serve --interface 127.0.0.1 ; zola build ; zola check

# Astro
npm create astro@latest s ; npm run dev -- --host 127.0.0.1 ; npm run build ; npx astro add sitemap

# Quartz
npx quartz create ; npx quartz build --serve ; npx quartz build ; npx quartz sync

# Publication
rsync -a --delete public/ web:/var/www/site/
```

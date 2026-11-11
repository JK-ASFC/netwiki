---
title: Notes et bases de connaissances — aide-mémoire
description: Ports, volumes et commandes de TriliumNext, Memos (Docker, API), SilverBullet (Docker, SB_USER), Logseq (Flatpak, synchronisation Git) et SiYuan (Docker, code d'accès).
tags: [aide-mémoire, triliumnext, memos, silverbullet, logseq, siyuan]
icon: terminal
---

Explications : [[01-triliumnext-memos|TriliumNext et Memos]] · [[02-silverbullet-logseq-siyuan|SilverBullet, Logseq et SiYuan]].

| Outil | Port | Données |
| --- | --- | --- |
| TriliumNext | 8080 | `trilium-data/document.db`, `backup/` |
| Memos | 5230 | `/var/opt/memos` (SQLite) ou base externe |
| SilverBullet | 3000 | `/space` (fichiers Markdown) |
| Logseq | — (bureau) | Dossier du graphe |
| SiYuan | 6806 | `/siyuan/workspace` |

```bash
docker run -d -p 127.0.0.1:8080:8080 -v /srv/trilium:/home/node/trilium-data triliumnext/trilium:latest
docker run -d -p 127.0.0.1:5230:5230 -v /srv/memos:/var/opt/memos neosmemo/memos:stable
docker run -d -p 127.0.0.1:3000:3000 -v /srv/silverbullet:/space -e SB_USER='admin:…' ghcr.io/silverbulletmd/silverbullet
docker run -d -p 127.0.0.1:6806:6806 -v /srv/siyuan:/siyuan/workspace -u 1000:1000 b3log/siyuan \
  --workspace=/siyuan/workspace/ --accessAuthCode='…'

# Memos : capture par API
curl -X POST https://memos.exemple.fr/api/v1/memos -H "Authorization: Bearer $JETON" \
  -H 'Content-Type: application/json' -d '{"content":"#note texte","visibility":"PRIVATE"}'

# Logseq / SilverBullet : versionner les notes Markdown
cd ~/notes && git add -A && git commit -qm "notes $(date +%F)" && git push -q

# Sauvegarde cohérente d'une base SQLite
sqlite3 /srv/trilium/document.db ".backup '/sauvegardes/trilium-$(date +%F).db'"
```

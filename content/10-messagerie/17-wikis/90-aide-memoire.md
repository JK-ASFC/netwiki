---
title: Wikis — aide-mémoire des commandes
description: Commandes des wikis et espaces de travail avec exemples — Outline et Wiki.js (Docker Compose, journaux, sauvegarde PostgreSQL), XWiki (Docker, volume permanent), MediaWiki (maintenance/run.php update, createAndPromote, dumpBackup), DokuWiki (Docker, sauvegarde des dossiers), Gollum (lancement, Docker), MoinMoin 2 (create-instance, index-create, import19, run), AppFlowy Cloud et AFFiNE (docker compose).
tags: [aide-mémoire, wiki, outline, wikijs, xwiki, mediawiki, dokuwiki, gollum]
icon: terminal
---

Explications : [[01-outline-wikijs|Outline, Wiki.js]] · [[02-xwiki|XWiki]] · [[03-mediawiki-dokuwiki|MediaWiki, DokuWiki]] · [[04-gollum-moinmoin-twiki|Gollum, MoinMoin, TWiki]] · [[05-appflowy-affine|AppFlowy, AFFiNE]].

## Outline, Wiki.js, XWiki

```bash
cd /srv/outline && docker compose up -d && docker compose logs -f outline
docker compose exec -T postgres pg_dump -U outline outline > /srv/sauvegardes/outline-$(date +%F).sql
docker logs -f wikijs ; docker exec wikijs-db pg_dump -U wikijs wiki > /srv/sauvegardes/wikijs-$(date +%F).sql
docker pull ghcr.io/requarks/wiki:2 && docker rm -f wikijs        # puis relancer le conteneur
docker compose logs -f web                                       # XWiki
docker run --rm -v xwiki-data:/data -v /srv/sauvegardes:/backup debian:stable-slim tar czf /backup/xwiki-permanent-$(date +%F).tar.gz -C /data .
```

## MediaWiki et DokuWiki

```bash
cd /var/www/mediawiki
sudo -u www-data php maintenance/run.php update
sudo -u www-data php maintenance/run.php createAndPromote --sysop jk 'MdpTemporaire2026!'
sudo -u www-data php maintenance/run.php dumpBackup --full > /srv/sauvegardes/wiki-pages-$(date +%F).xml
mysqldump --single-transaction wiki > /srv/sauvegardes/wiki-$(date +%F).sql
sudo tar czf /srv/sauvegardes/dokuwiki-$(date +%F).tar.gz -C /var/www/dokuwiki data conf lib/plugins
docker run -d --name dokuwiki -p 127.0.0.1:8081:8080 -v /srv/dokuwiki:/storage dokuwiki/dokuwiki:stable
```

## Gollum et MoinMoin

```bash
gollum --port 4567 --host 127.0.0.1 --allow-uploads dir --ref main /srv/wiki-infra
docker run -d --name gollum -p 127.0.0.1:4567:4567 -v /srv/wiki-infra:/wiki gollumwiki/gollum:master
git -C /srv/wiki-infra log --oneline -5 ; git -C /srv/wiki-infra push origin main
/opt/moin/bin/moin create-instance --path /srv/moin/wiki-infra
cd /srv/moin/wiki-infra && /opt/moin/bin/moin index-create && /opt/moin/bin/moin run
/opt/moin/bin/moin import19 -d /srv/moin19/wiki/data
```

## AppFlowy Cloud et AFFiNE

```bash
cd AppFlowy-Cloud && git pull && docker compose pull && docker compose up -d
cd /opt/affine && docker compose pull && docker compose up -d && docker compose logs -f affine
```

---
title: Pydio Cells, Cozy, ProjectSend et Pingvin Share — aide-mémoire
description: Commandes Pydio Cells (cells start, configure, version, admin user create/set-pwd, admin config, ps), Cozy (cozy-stack instances add/ls/modify/destroy, apps install/update, fsck, config passwd), ProjectSend et Pingvin Share (Docker, journaux, sauvegarde des volumes et de la base) avec exemples.
tags: [aide-mémoire, pydio cells, cozy, projectsend, pingvin share]
icon: terminal
---

Explications : [[01-pydio-cells|Pydio Cells]] · [[02-cozy-cloud|Cozy]] · [[03-projectsend-pingvin|ProjectSend et Pingvin Share]].

```bash
cells version ; cells start ; cells ps ; cells admin user set-pwd -u admin ; cells admin config list | head
sudo journalctl -u cells -f ; mysqldump cells > /sauv/cells.sql
cozy-stack instances ls ; cozy-stack instances modify jk.cozy.corp.exemple.fr --disk-quota 50GB ; cozy-stack instances fsck jk.cozy.corp.exemple.fr
cozy-stack apps install --domain jk.cozy.corp.exemple.fr notes ; cozy-stack apps update --domain jk.cozy.corp.exemple.fr drive
docker logs -f projectsend ; docker exec projectsend ls /data ; mysqldump projectsend > /sauv/projectsend.sql
docker compose logs -f pingvin-share ; tar czf /sauv/pingvin-$(date +%F).tgz data images
```

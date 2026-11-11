---
title: PaaS auto-hébergés — aide-mémoire
description: Installation et commandes de Coolify (script), Dokku (apps, postgres, domains, letsencrypt, git push) et CapRover (conteneur, caprover serversetup et deploy).
tags: [aide-mémoire, coolify, dokku, caprover, paas, git push]
icon: terminal
---

Explications : [[01-coolify-dokku-caprover|Coolify, Dokku et CapRover]].

| PaaS | Interface | Base |
| --- | --- | --- |
| Coolify | 8000 | Docker |
| Dokku | ligne de commande | Docker |
| CapRover | 3000 (setup), 80/443 | Docker Swarm |

```bash
# Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash

# Dokku
dokku apps:create monappli
dokku postgres:create madb && dokku postgres:link madb monappli
dokku domains:set monappli app.exemple.fr ; dokku letsencrypt:enable monappli
dokku logs monappli -t ; dokku ps:rebuild monappli
git remote add dokku dokku@serveur:monappli && git push dokku main

# CapRover
docker run -d -p 80:80 -p 443:443 -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain --name captain caprover/caprover
npm install -g caprover ; caprover serversetup ; caprover deploy
```

---
title: Tableaux de bord — aide-mémoire
description: Déploiement Docker et ports de Homepage, Homarr, Dashy, Heimdall, Flame, Organizr, Glance et Homer, et rappel de sécurité sur les clés d'API et le socket Docker.
tags: [aide-mémoire, homepage, homarr, dashy, heimdall, flame, glance, homer, dashboard]
icon: terminal
---

Explications : [[01-homepage-homarr-dashy|Homepage, Homarr, Dashy, Heimdall]] · [[02-flame-glance-homer|Flame, Organizr, Glance, Homer et autres]].

| Dashboard | Config | Découverte Docker |
| --- | --- | --- |
| Homepage | YAML | oui (étiquettes) |
| Homarr | interface | oui |
| Dashy | YAML | partielle |
| Heimdall | interface | non |
| Flame | interface | partielle |
| Glance | YAML | oui (widget) |
| Homer | YAML statique | non |

```bash
# Homepage
docker run -d -p 3000:3000 -v /srv/homepage/config:/app/config \
  -v /var/run/docker.sock:/var/run/docker.sock:ro -e HOMEPAGE_ALLOWED_HOSTS=home.exemple.fr ghcr.io/gethomepage/homepage:latest

# Homarr
docker run -d -p 7575:7575 -v /srv/homarr/data:/appdata ghcr.io/homarr-labs/homarr:latest

# Dashy
docker run -d -p 8080:8080 -v /srv/dashy/conf.yml:/app/user-data/conf.yml lissy93/dashy:latest

# Heimdall
docker run -d -p 8081:80 -v /srv/heimdall:/config lscr.io/linuxserver/heimdall:latest

# Glance / Homer / Flame
docker run -d -p 8082:8080 -v /srv/glance/glance.yml:/app/config/glance.yml glanceapp/glance
docker run -d -p 8083:8080 -v /srv/homer:/www/assets b4bz/homer:latest
docker run -d -p 5005:5005 -v /srv/flame:/app/data -e PASSWORD='…' pawelmalak/flame
```

> Clés d'API des widgets en variables d'environnement, socket Docker en lecture seule, accès protégé (auth intégrée ou proxy/SSO).

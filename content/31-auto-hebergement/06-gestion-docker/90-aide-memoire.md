---
title: Gestion de conteneurs Docker — aide-mémoire
description: Déploiement et ports de Dockge, Yacht et Komodo, et rappel de sécurité sur le socket Docker (proxy en lecture seule).
tags: [aide-mémoire, dockge, yacht, komodo, docker, compose]
icon: terminal
---

Explications : [[01-dockge-yacht-komodo|Dockge, Yacht et Komodo]].

| Outil | Port | Particularité |
| --- | --- | --- |
| Dockge | 5001 | piles Compose sur disque |
| Yacht | 8000 | modèles d'applications |
| Komodo | selon compose | multi-serveurs + agent periphery |
| Portainer (rappel) | 9443 | complet |

```bash
# Dockge
docker run -d -p 5001:5001 -v /var/run/docker.sock:/var/run/docker.sock \
  -v /opt/dockge/data:/app/data -v /opt/stacks:/opt/stacks -e DOCKGE_STACKS_DIR=/opt/stacks louislam/dockge:1

# Yacht
docker run -d -p 8000:8000 -v /var/run/docker.sock:/var/run/docker.sock -v yacht:/config selfhostedpro/yacht

# Komodo : docker-compose du projet (cœur + base) + agent periphery sur chaque hôte

# Limiter l'accès au socket (proxy lecture seule)
docker run -d --name docker-proxy -e CONTAINERS=1 -e IMAGES=1 -e POST=0 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro -p 127.0.0.1:2375:2375 ghcr.io/tecnativa/docker-socket-proxy
```

> Ne jamais exposer ces interfaces sur Internet ; HTTPS + authentification ; le socket Docker = contrôle total de l'hôte.

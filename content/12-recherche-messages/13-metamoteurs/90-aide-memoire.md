---
title: Métamoteurs — aide-mémoire
description: Ports, déploiement et commandes de SearXNG (Docker Compose, settings.yml, recherche JSON), Whoogle (Docker), 4get et LibreY.
tags: [aide-mémoire, searxng, whoogle, 4get, librex, librey]
icon: terminal
---

Explications : [[01-searxng-whoogle-4get-librex|SearXNG, Whoogle, 4get et LibreX]].

| Outil | Port | Configuration |
| --- | --- | --- |
| SearXNG | 8080 | `/etc/searxng/settings.yml`, `limiter.toml` |
| Whoogle | 5000 | Variables `WHOOGLE_*` |
| 4get | 80 (PHP / conteneur) | `data/config.php` |
| LibreY | 80 (PHP / conteneur) | `config.php` |

```bash
# SearXNG
openssl rand -hex 32                          # secret_key
docker compose up -d ; docker compose logs -f searxng
curl -s "http://127.0.0.1:8080/search?q=test&format=json" | jq '.results | length'
curl -s http://127.0.0.1:8080/healthz

# Whoogle
docker run -d -p 127.0.0.1:5000:5000 -e WHOOGLE_CONFIG_LANGUAGE=lang_fr benbusby/whoogle-search:latest
```

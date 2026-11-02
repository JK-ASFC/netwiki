---
title: Kong Gateway (OSS)
description: Kong Gateway open source — passerelle d'API sur NGINX/OpenResty : notions (services, routes, upstreams et targets, consommateurs, greffons), modes (base PostgreSQL, sans base déclaratif DB-less, hybride), installation Docker, paquets Linux, Kubernetes (Kong Ingress Controller), fichier kong.yml, greffons courants (key-auth, jwt, oauth2, acl, rate-limiting, cors, request-transformer, prometheus), API d'administration (port 8001), Kong Manager OSS (8002), decK, sécurité de l'administration et politique de distribution des versions libres.
tags: [kong, api gateway, passerelle api, openresty, rate limiting, deck, kubernetes]
icon: info
---

**Kong** est la passerelle d'API la plus répandue : bâtie sur [[12-openresty/01-presentation-installation|OpenResty]], elle place devant vos services l'**authentification**, la **limitation de débit**, la transformation, la journalisation et la supervision, sous forme de **greffons** activés par service, route ou consommateur.

| Objet | Rôle |
| --- | --- |
| **Service** | API amont (URL) |
| **Route** | Règle d'entrée (chemins, hôtes, méthodes) vers un service |
| Upstream / Target | Répartition de charge et contrôles de santé entre plusieurs instances |
| **Consumer** | Client de l'API (application, partenaire) avec ses identifiants |
| **Plugin** | Fonction appliquée globalement, par service, route ou consommateur |

> [!WARNING]
> Kong Inc. a restreint la distribution des binaires et images « OSS » prêts à l'emploi (les dernières versions libres publiées sont dans la branche 3.9) ; le code reste ouvert. Vérifiez la politique en vigueur avant de démarrer un projet, et comparez avec [[02-apisix|Apache APISIX]], entièrement communautaire.

## Installation sans base (DB-less, Docker)

```yaml
# kong.yml — configuration déclarative
_format_version: "3.0"
services:
  - name: api-commandes
    url: http://10.0.20.10:8080
    routes:
      - name: commandes
        paths: ["/commandes"]
    plugins:
      - name: key-auth
      - name: rate-limiting
        config: { minute: 60, policy: local }
consumers:
  - username: appli-mobile
    keyauth_credentials:
      - key: cle-appli-mobile-2026
plugins:
  - name: prometheus
```

```bash
docker run -d --name kong \
  -e KONG_DATABASE=off -e KONG_DECLARATIVE_CONFIG=/kong/kong.yml \
  -e KONG_PROXY_LISTEN="0.0.0.0:8000, 0.0.0.0:8443 ssl" \
  -e KONG_ADMIN_LISTEN="0.0.0.0:8001" -e KONG_ADMIN_GUI_LISTEN="0.0.0.0:8002" \
  -v "$PWD/kong.yml:/kong/kong.yml:ro" \
  -p 8000:8000 -p 8443:8443 -p 127.0.0.1:8001:8001 -p 127.0.0.1:8002:8002 kong:3.9
curl -i http://localhost:8000/commandes -H "apikey: cle-appli-mobile-2026"
```

Avec base **PostgreSQL** (configuration modifiable à chaud par l'API) : `KONG_DATABASE=postgres`, `KONG_PG_HOST`, puis `kong migrations bootstrap`. Kubernetes : **Kong Ingress Controller** (CRD `KongPlugin`, ressources Ingress ou Gateway API).

## API d'administration

```bash
curl -s localhost:8001/status | jq .
curl -s -X POST localhost:8001/services --data name=api-stock --data url=http://10.0.20.11:8080
curl -s -X POST localhost:8001/services/api-stock/routes --data 'paths[]=/stock' --data name=stock
curl -s -X POST localhost:8001/services/api-stock/plugins --data name=rate-limiting --data config.minute=120
curl -s localhost:8001/routes | jq '.data[] | {name, paths}'
```

> [!WARNING]
> L'API d'administration donne le contrôle total de la passerelle : ne l'exposez **jamais** publiquement (écoute sur `127.0.0.1` ou réseau d'administration, filtrage, ou greffon d'authentification devant elle).

**decK** gère la configuration comme du code (Git, revues, CI) :

```bash
deck gateway dump -o kong.yml
deck gateway diff kong.yml
deck gateway sync kong.yml
```

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].

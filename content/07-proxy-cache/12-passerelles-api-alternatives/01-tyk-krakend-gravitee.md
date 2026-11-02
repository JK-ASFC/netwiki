---
title: Tyk, KrakenD et Gravitee
description: Passerelles d'API open source alternatives — Tyk Gateway OSS (Go, Redis, définitions d'API JSON/OAS, API de la passerelle, rechargement), KrakenD Community Edition (Go, sans état, agrégation de backends, krakend.json, check, run, audit, designer), Gravitee APIM Community (gestion complète : passerelle, Management API, console, portail développeur, MongoDB et Elasticsearch) : installation Docker et paquets, exemples de configuration et choix entre ces solutions.
tags: [tyk, krakend, gravitee, api gateway, gestion d'api, go]
icon: info
---

| Solution | Points forts | Limites de l'édition libre |
| --- | --- | --- |
| **Tyk Gateway OSS** (MPL) | Go, rapide, quotas et clés, OAS natif, GraphQL | Tableau de bord et portail réservés à l'offre payante |
| **KrakenD CE** (Apache 2.0) | **Sans état** (aucune base), agrégation et transformation de réponses (*backend for frontend*), très performant | Pas de gestion dynamique : la configuration est un fichier |
| **Gravitee APIM CE** (Apache 2.0) | Plate-forme complète : console, **portail développeur**, plans et abonnements, analytique | Plus lourde (MongoDB, Elasticsearch) |

Pour la référence du marché, voir aussi [[11-kong-apisix/01-kong|Kong]] et [[11-kong-apisix/02-apisix|APISIX]].

## Tyk Gateway OSS

```bash
docker network create tyk
docker run -d --name tyk-redis --network tyk redis:7
docker run -d --name tyk-gateway --network tyk -p 8080:8080 \
  -e TYK_GW_SECRET=SecretPasserelle2026 -e TYK_GW_STORAGE_HOST=tyk-redis \
  -v "$PWD/apps:/opt/tyk-gateway/apps" tykio/tyk-gateway:v5.8
```

Paquets DEB/RPM (dépôts packagecloud de Tyk) : service `tyk-gateway`, configuration `/opt/tyk-gateway/tyk.conf`.

```bash
# Ajouter une API via l'API de la passerelle, puis recharger
curl -s -H "x-tyk-authorization: SecretPasserelle2026" -X POST http://localhost:8080/tyk/apis -d @api-commandes.json
curl -s -H "x-tyk-authorization: SecretPasserelle2026" http://localhost:8080/tyk/reload/group
curl -s -H "x-tyk-authorization: SecretPasserelle2026" http://localhost:8080/tyk/apis | jq '.[].name'
curl -s http://localhost:8080/hello                 # état de la passerelle et de Redis
```

## KrakenD Community Edition

```bash
brew install krakend                                                       # macOS
docker run -d -p 8080:8080 -v "$PWD:/etc/krakend" krakend:2.10 run -c /etc/krakend/krakend.json
# Debian/Ubuntu : dépôt repo.krakend.io puis « sudo apt install krakend »
```

```json
{
  "$schema": "https://www.krakend.io/schema/krakend.json",
  "version": 3,
  "port": 8080,
  "timeout": "3s",
  "endpoints": [
    {
      "endpoint": "/v1/tableau-de-bord/{client}",
      "method": "GET",
      "backend": [
        { "host": ["http://10.0.20.10:8080"], "url_pattern": "/clients/{client}", "group": "client" },
        { "host": ["http://10.0.20.11:8080"], "url_pattern": "/commandes?client={client}", "group": "commandes", "is_collection": true }
      ]
    }
  ]
}
```

Un seul appel client agrège deux services. Outils : `krakend check -tlc krakend.json` (syntaxe, lint), `krakend audit -c krakend.json` (recommandations de sécurité), éditeur visuel **KrakenD Designer** (en ligne ou conteneur `krakend/designer`).

## Gravitee APIM Community

Récupérer le fichier `docker-compose.yml` du **démarrage rapide** de la documentation Gravitee (dépôt `gravitee-io/gravitee-api-management`, dossier `docker/quick-setup`), puis :

```bash
docker compose up -d
```

| Composant | Port (démarrage rapide) |
| --- | --- |
| Passerelle | 8082 |
| Management API | 8083 |
| **Console** (administration) | 8084 |
| **Portail développeur** | 8085 |

Compte initial `admin`/`admin` à changer. Flux : créer une API (proxy HTTP, ou import OpenAPI), définir des **plans** (sans clé, clé d'API, JWT, OAuth2), publier sur le portail ; les développeurs s'**abonnent** et obtiennent leurs clés.

<!-- CAPTURE: Gravitee — console, liste des API et plans | _assets/gravitee-console.png -->
<!-- CAPTURE: Gravitee — portail développeur | _assets/gravitee-portail.png -->
<!-- CAPTURE: KrakenD Designer — édition d'un endpoint agrégé | _assets/krakend-designer.png -->

Suite : [[02-zuul-ocelot-yarp|Zuul, Ocelot et YARP]] · [[90-aide-memoire|aide-mémoire]].

---
title: Dgraph
description: Dgraph — base de graphes distribuée native (Apache 2.0) avec GraphQL et DQL : architecture (Zero pour la coordination, Alpha pour les données), installation (Docker dgraph/standalone, binaires Linux, Docker Compose de cluster), ports (5080, 6080, 7080, 8080, 9080), schéma GraphQL et DQL, mutations et requêtes, Ratel (interface), ACL et chiffrement (fonctions d'édition), export et sauvegarde, état du projet.
tags: [dgraph, graphe, graphql, dql, badger, distribué]
icon: info
---

**Dgraph** stocke le graphe sur [[20-moteurs-embarques/01-presentation-comparatif|BadgerDB]] et le répartit entre nœuds **Alpha** coordonnés par des nœuds **Zero**. On l'interroge en **GraphQL** (schéma fourni → API générée) ou en **DQL** (langage natif). Le projet a changé plusieurs fois de propriétaire (Dgraph Labs, Hypermode, puis Istari Digital) : vérifiez son activité avant un nouveau déploiement.

| Port | Usage |
| --- | --- |
| 5080 / 6080 | Zero : interne / HTTP d'administration |
| 7080 | Alpha : interne |
| **8080** | Alpha : HTTP (GraphQL, DQL, `/admin`) |
| 9080 | Alpha : gRPC (clients) |

## Installation

```bash
docker run -d --name dgraph -p 8080:8080 -p 9080:9080 -v /srv/dgraph:/dgraph dgraph/standalone:latest   # Zero + Alpha (test)
# Production (Linux) : binaire dgraph, un Zero et des Alpha
dgraph zero --my=10.0.20.191:5080 --replicas 3
dgraph alpha --my=10.0.20.192:7080 --zero=10.0.20.191:5080 --security "whitelist=10.0.20.0/24"
```

Windows et macOS : Docker.

```bash
# Schéma GraphQL → API générée sur /graphql
curl -X POST localhost:8080/admin/schema --data-binary 'type Equipement { nom: String! @search(by: [exact]) site: String uplinks: [Equipement] }'
curl -s -H "Content-Type: application/json" localhost:8080/graphql \
  -d '{"query":"{ queryEquipement(filter: {nom: {eq: \"sw-coeur-01\"}}) { nom site } }"}'
# Export (JSON ou RDF) pour sauvegarde
curl -s localhost:8080/admin -H "Content-Type: application/json" -d '{"query":"mutation { export(input: {format: \"json\"}) { response { message } } }"}'
```

`--security whitelist=` restreint les opérations d'administration ; publiez `8080` derrière un reverse proxy authentifié. Interface : [[04-interface-graphique|Ratel]] · commandes : [[90-aide-memoire|aide-mémoire]].

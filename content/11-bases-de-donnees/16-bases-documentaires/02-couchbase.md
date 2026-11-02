---
title: Couchbase Server Community
description: Couchbase Server Community Edition — base documentaire JSON distribuée avec cache mémoire intégré et langage SQL++ (N1QL) : services (Data, Index, Query, Search, Analytics, Eventing), différences Community et Enterprise, installation (paquets Debian/Ubuntu et RHEL, Windows, macOS, Docker), ports (8091 console), initialisation avec couchbase-cli, buckets, scopes et collections, index et requêtes avec cbq, utilisateurs RBAC, réplication XDCR, sauvegarde et rééquilibrage.
tags: [couchbase, nosql, document, json, sql++, n1ql, cache]
icon: info
---

**Couchbase** combine un **cache mémoire** (héritage de [[05-memcached/01-presentation-installation|Memcached]]) et une base **documentaire JSON** distribuée, interrogeable en **SQL++**. L'édition **Community** est gratuite mais en retard sur l'Enterprise (fonctions avancées de sauvegarde, sécurité, réplication filtrée, support).

## Installation

```bash
# Debian/Ubuntu : paquet de la version Community depuis couchbase.com/downloads (choisir « Community »)
sudo apt install ./couchbase-server-community_*_amd64.deb
# RHEL : sudo dnf install ./couchbase-server-community-*.rpm
docker run -d --name couchbase -p 8091-8097:8091-8097 -p 11210:11210 couchbase:community
```

Windows et macOS : installeurs du site. Désactiver les *transparent huge pages* et régler `vm.swappiness=1` sur Linux.

## Initialisation

```bash
couchbase-cli cluster-init -c localhost --cluster-name Corp --cluster-username Administrator --cluster-password "$MDP" \
  --services data,index,query --cluster-ramsize 2048 --cluster-index-ramsize 512
couchbase-cli bucket-create -c localhost -u Administrator -p "$MDP" --bucket inventaire --bucket-type couchbase --bucket-ramsize 1024
couchbase-cli server-add -c localhost -u Administrator -p "$MDP" --server-add https://10.0.20.122:18091 \
  --server-add-username Administrator --server-add-password "$MDP" --services data,index,query
couchbase-cli rebalance -c localhost -u Administrator -p "$MDP"
```

```sql
-- cbq -e http://localhost:8093 -u Administrator -p "$MDP"
CREATE PRIMARY INDEX ON inventaire;
CREATE INDEX idx_site ON inventaire(site);
SELECT nom, site FROM inventaire WHERE type = "commutateur" AND site = "paris" LIMIT 10;
```

Console web : `http://<hôte>:8091` ([[05-interface-graphique|interfaces graphiques]]). Commandes : [[90-aide-memoire|aide-mémoire]].

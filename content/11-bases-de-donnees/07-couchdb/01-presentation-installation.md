---
title: Présentation et installation
description: Apache CouchDB — base documentaire JSON accessible en HTTP, révisions MVCC, vues MapReduce et requêtes Mango, réplication multi-maîtres et usage hors ligne, cluster (shards q, copies n), ports, installation depuis le dépôt officiel (Debian/Ubuntu, RHEL), sous Windows, macOS et Docker, et premiers appels à l'API.
tags: [couchdb, nosql, document, réplication, http, installation, fauxton]
icon: info
---

**Apache CouchDB** stocke des documents **JSON** et s'utilise entièrement en **HTTP/REST**. Sa spécificité est la **réplication multi-maîtres** : des copies d'une base peuvent être modifiées indépendamment (serveurs distants, applications mobiles hors ligne avec PouchDB) puis synchronisées, les conflits étant détectés et conservés.

## Concepts

| Notion | Description |
| --- | --- |
| Document | Objet JSON avec `_id` et **`_rev`** (révision) ; pièces jointes possibles |
| MVCC | Toute mise à jour doit fournir la `_rev` actuelle, sinon `409 Conflict` |
| **Vues** | Index MapReduce définis en JavaScript dans des *design documents* |
| **Mango** | Requêtes déclaratives JSON (`_find`) avec index |
| **Réplication** | Unidirectionnelle ou bidirectionnelle, ponctuelle ou continue, entre bases locales ou distantes |
| Cluster | Une base est découpée en **q** shards, chacun copié **n** fois (défaut q=2, n=3) |
| Fauxton | Interface web d'administration (`/_utils`) |

## Ports

| Port | Usage |
| --- | --- |
| **5984** | API HTTP (clients, Fauxton, réplication) |
| 6984 | HTTPS natif (si activé) |
| 4369 | `epmd` (Erlang) — cluster |
| 9100-9200 | Distribution Erlang entre nœuds — cluster (plage à fixer) |

## Installation

### Debian / Ubuntu

```bash
sudo apt install -y curl apt-transport-https gnupg
curl https://couchdb.apache.org/repo/keys.asc | gpg --dearmor | sudo tee /usr/share/keyrings/couchdb-archive-keyring.gpg >/dev/null
source /etc/os-release
echo "deb [signed-by=/usr/share/keyrings/couchdb-archive-keyring.gpg] https://apache.jfrog.io/artifactory/couchdb-deb/ ${VERSION_CODENAME} main" \
  | sudo tee /etc/apt/sources.list.d/couchdb.list
sudo apt update && sudo apt install -y couchdb
```

L'assistant debconf demande : mode **autonome** ou **cluster**, adresse d'écoute, mot de passe **administrateur**, cookie Erlang (cluster).

### RHEL / Rocky / Alma

```bash
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://couchdb.apache.org/repo/couchdb.repo
sudo dnf install -y couchdb
# Définir l'administrateur dans /opt/couchdb/etc/local.ini avant le premier démarrage
sudo systemctl enable --now couchdb
```

### Windows, macOS, Docker

| Plate-forme | Installation |
| --- | --- |
| Windows | Installateur MSI officiel (service *Apache CouchDB*, configuration `C:\CouchDB\etc\local.ini`) |
| macOS | Application *Apache CouchDB* (glisser dans Applications) ou `brew install couchdb` |
| Docker | `docker run -d --name couchdb -e COUCHDB_USER=admin -e COUCHDB_PASSWORD='…' -v couchdb-data:/opt/couchdb/data -p 127.0.0.1:5984:5984 couchdb:3` |

> [!NOTE]
> Depuis CouchDB 3, un **administrateur est obligatoire** : le mode historique « admin party » (tout le monde administrateur) n'existe plus.

## Premiers appels

```bash
curl -s http://127.0.0.1:5984/                                       # version
curl -s -u admin:MotDePasse http://127.0.0.1:5984/_up                 # santé
curl -s -u admin:MotDePasse -X PUT http://127.0.0.1:5984/inventaire   # créer une base
curl -s -u admin:MotDePasse -X POST http://127.0.0.1:5984/inventaire \
     -H 'Content-Type: application/json' -d '{"nom":"srv-web-01","site":"Paris"}'
curl -s -u admin:MotDePasse -X POST http://127.0.0.1:5984/inventaire/_find \
     -H 'Content-Type: application/json' -d '{"selector":{"site":"Paris"}}'
curl -s -u admin:MotDePasse http://127.0.0.1:5984/_all_dbs
```

Interface d'administration : `http://127.0.0.1:5984/_utils/` (Fauxton).

## Suite du parcours

1. [[02-configuration-replication-securite|Configuration, sécurité, cluster et réplication]]
2. [[03-exploitation-depannage|Exploitation et dépannage]]

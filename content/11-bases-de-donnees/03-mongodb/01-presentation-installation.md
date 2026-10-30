---
title: Présentation et installation
description: MongoDB — modèle documentaire (BSON, collections, schéma souple), moteur WiredTiger, replica sets et sharding, licence SSPL, versions, installation depuis le dépôt officiel (Debian/Ubuntu, RHEL), sous Windows (MSI, service), macOS (Homebrew) et Docker, réglages système recommandés et shell mongosh.
tags: [mongodb, nosql, document, installation, mongosh, wiredtiger, sspl]
icon: info
---

**MongoDB** est une base de données **documentaire** : les enregistrements sont des documents JSON (stockés en **BSON**) regroupés en **collections**, sans schéma imposé. Elle est conçue pour la montée en charge horizontale (sharding) et la haute disponibilité (replica sets).

## Concepts

| MongoDB | Équivalent relationnel |
| --- | --- |
| Base | Base |
| **Collection** | Table |
| **Document** (BSON) | Ligne (mais imbriqué : tableaux, sous-documents) |
| Champ | Colonne |
| `_id` | Clé primaire |
| Index | Index |
| Pipeline d'agrégation | `GROUP BY`, jointures (`$lookup`) |

```javascript
// Exemple de document
{
  _id: ObjectId("6720f3a1c2a4b8e5d1f0a9b2"),
  nom: "srv-web-01",
  site: "Paris",
  interfaces: [ { nom: "ens192", ip: "10.0.20.15" }, { nom: "ens224", ip: "10.0.99.15" } ],
  tags: ["production", "web"],
  miseEnService: ISODate("2024-03-12T00:00:00Z")
}
```

## Architecture

| Élément | Rôle |
| --- | --- |
| `mongod` | Serveur de données (moteur **WiredTiger** : compression, verrouillage au niveau document) |
| **Replica set** | Groupe de `mongod` (1 primaire + secondaires) : haute disponibilité, élection automatique |
| **Sharding** | Répartition des données entre plusieurs replica sets (*shards*) |
| `mongos` | Routeur des requêtes dans un cluster shardé |
| Serveurs de configuration | Métadonnées du cluster shardé (replica set dédié) |
| `mongosh` | Shell interactif (JavaScript) |

## Licence et versions

- L'édition **Community** est sous licence **SSPL** (non reconnue comme libre par l'OSI) : les distributions ne l'empaquettent plus ; on utilise le **dépôt officiel** de MongoDB.
- L'édition **Enterprise** ajoute LDAP/Kerberos, chiffrement au repos, audit. **Percona Server for MongoDB** est une alternative compatible qui inclut certaines de ces fonctions.
- Versions majeures récentes : **7.0**, **8.0** (2024). Mise à niveau d'une version majeure à la fois.

## Installation

### Debian / Ubuntu

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/8.0 main" \
  | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
# Ubuntu 24.04 : "… https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse"
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

### RHEL / Rocky / Alma

```ini /etc/yum.repos.d/mongodb-org-8.0.repo
[mongodb-org-8.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/8.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-8.0.asc
```

```bash
sudo dnf install -y mongodb-org
sudo systemctl enable --now mongod
```

### Windows

Installateur MSI (option « Install as a Service ») depuis le centre de téléchargement MongoDB, ou :

```powershell
winget install --id MongoDB.Server -e
Get-Service MongoDB
# Configuration : C:\Program Files\MongoDB\Server\8.0\bin\mongod.cfg ; données : …\data
winget install --id MongoDB.Shell -e            # mongosh
```

### macOS

```bash
brew tap mongodb/brew
brew install mongodb-community@8.0
brew services start mongodb-community@8.0
```

### Docker

```bash
docker run -d --name mongo --restart unless-stopped \
  -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD='MotDePasse' \
  -v mongo-data:/data/db -p 127.0.0.1:27017:27017 mongo:8.0
```

## Réglages système (Linux)

| Réglage | Recommandation |
| --- | --- |
| Système de fichiers | **XFS** pour WiredTiger |
| Limites | `nofile` et `nproc` ≥ 64000 (fournies par l'unité systemd du paquet) |
| *Transparent Huge Pages* | **Activées** à partir de MongoDB 8.0 ; désactivées pour les versions antérieures |
| NUMA | Désactiver l'entrelacement ou lancer avec `numactl --interleave=all` |
| `vm.swappiness` | 1 |
| Heure | Synchronisée (chrony) sur tous les membres |

## Premiers pas avec mongosh

```javascript
// mongosh "mongodb://127.0.0.1:27017"
show dbs
use inventaire
db.serveurs.insertOne({ nom: "srv-web-01", site: "Paris", tags: ["production"] })
db.serveurs.find({ site: "Paris" }).limit(5)
db.serveurs.createIndex({ nom: 1 }, { unique: true })
db.serveurs.countDocuments()
```

Avant toute ouverture réseau, activez l'**authentification** : [[02-configuration-securite]].

## Suite du parcours

1. [[02-configuration-securite|Configuration et sécurité]]
2. [[03-replica-sets-sharding|Replica sets et sharding]]
3. [[04-sauvegarde-exploitation-depannage|Sauvegarde, exploitation et dépannage]]

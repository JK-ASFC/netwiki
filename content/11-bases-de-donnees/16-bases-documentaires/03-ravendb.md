---
title: RavenDB
description: RavenDB — base documentaire ACID en .NET (Windows, Linux, macOS, ARM) avec interface d'administration Studio : licence Community gratuite (limites de cœurs et de mémoire, enregistrement), installation (archive, paquet .deb, Docker, service Windows), assistant de configuration sécurisé (certificats, domaine ravendb.run ou certificat propre), Studio, collections, index et requêtes RQL, cluster et réplication, sauvegardes périodiques, rvn admin-channel.
tags: [ravendb, nosql, document, .net, acid, studio]
icon: info
---

**RavenDB** est une base documentaire **transactionnelle** (ACID multi-documents) très appréciée des équipes .NET, avec une interface web complète (**Studio**). La licence **Community** est gratuite (enregistrement requis) avec des limites de cœurs et de mémoire par nœud ; les fonctions avancées (chiffrement au repos, certaines intégrations) demandent une licence payante.

## Installation

```bash
# Linux (Debian/Ubuntu) : paquet .deb depuis ravendb.net/download
sudo apt install ./ravendb_*_amd64.deb      # service ravendb, assistant sur http://127.0.0.1:53700 (indiqué à l'installation)
# Archive (Linux, macOS, Windows) : ./run.sh (Linux/macOS) ou .\run.ps1 puis .\setup-as-service.ps1 (Windows)
docker run -d -p 8080:8080 -p 38888:38888 ravendb/ravendb
```

L'**assistant de configuration** propose : sécurisé avec certificat Let's Encrypt et sous-domaine `*.ravendb.run`, sécurisé avec votre propre certificat, ou non sécurisé (laboratoire uniquement). Il génère le **certificat client d'administration** (`.pfx`) à importer dans le navigateur.

| Port | Usage |
| --- | --- |
| 443 ou 8080 | HTTP(S) : Studio, API, clients |
| 38888 | TCP entre nœuds du cluster et réplication |

## Utilisation

- Studio : bases, collections, documents, **index** (Map/Reduce), requêtes **RQL** (`from Equipements where Site = "paris"`), tâches (sauvegardes périodiques, réplication externe, ETL vers SQL ou Elasticsearch).
- Console serveur : `rvn admin-channel` (Linux) pour les commandes d'administration locales (réinitialiser un certificat, voir l'état).

Interface : [[05-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].

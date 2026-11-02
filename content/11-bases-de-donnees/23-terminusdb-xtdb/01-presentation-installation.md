---
title: Présentation, installation et utilisation
description: TerminusDB et XTDB — bases conservant l'historique complet des données : TerminusDB (Apache 2.0, graphe et documents JSON versionnés avec branches, commits, fusion, clonage et synchronisation à la manière de Git, schéma, WOQL et GraphQL, installation Docker et binaire, CLI tdb, interface TerminusCMS) et XTDB (MPL 2.0, JUXT, base SQL bitemporelle immuable : temps valide et temps système, requêtes « AS OF », protocole PostgreSQL, installation Docker, stockage objet et journal Kafka), cas d'usage (audit, inventaire historisé, conformité).
tags: [terminusdb, xtdb, versionnement, bitemporel, historique, audit]
icon: info
---

Ces deux bases répondent à la question « **quel était l'état exact des données à telle date, et qui l'a changé ?** » — utile pour un inventaire d'infrastructure, une CMDB, des données réglementées ou des configurations.

| | **TerminusDB** | **XTDB** |
| --- | --- | --- |
| Modèle | Documents JSON et graphe | Tables SQL (documents) |
| Historique | **Commits, branches, fusions** (modèle Git) | **Bitemporel** : temps *valide* et temps *système* |
| Langages | WOQL, GraphQL, API documents | **SQL** (protocole PostgreSQL), XTQL |
| Licence | Apache 2.0 | MPL 2.0 |

## TerminusDB

```bash
docker run -d --name terminusdb -p 6363:6363 -v /srv/terminusdb:/app/terminusdb/storage \
  -e TERMINUSDB_ADMIN_PASS="$MDP" terminusdb/terminusdb-server:latest
docker exec -it terminusdb ./terminusdb db create admin/cmdb --label "CMDB"
docker exec -it terminusdb ./terminusdb branch create admin/cmdb/local/branch/migration-2026
docker exec -it terminusdb ./terminusdb log admin/cmdb
```

Une modification se fait sur une branche, se relit, puis se **fusionne** ; on peut cloner une base entre serveurs (`clone`, `push`, `pull`). Interface web sur `http://<hôte>:6363` (tableau de bord local) ; client Python `terminusdb-client`.

## XTDB

```bash
docker run -d --name xtdb -p 5432:5432 -p 8080:8080 -v /srv/xtdb:/var/lib/xtdb ghcr.io/xtdb/xtdb:latest
psql -h localhost -p 5432 -U xtdb xtdb
```

```sql
INSERT INTO equipements (_id, nom, site, _valid_from) VALUES ('sw1', 'sw-coeur-01', 'paris', TIMESTAMP '2025-01-15 00:00:00');
UPDATE equipements SET site = 'lyon' WHERE _id = 'sw1';
-- État tel qu'il était connu au 1er mars 2025
SELECT * FROM equipements FOR VALID_TIME AS OF TIMESTAMP '2025-03-01 00:00:00';
-- Historique complet d'un enregistrement
SELECT *, _valid_from, _valid_to, _system_from FROM equipements FOR ALL VALID_TIME WHERE _id = 'sw1';
```

En production, XTDB 2 sépare le journal des transactions (Kafka) et le stockage (S3/MinIO, Azure Blob) pour plusieurs nœuds sans état.

Commandes : [[90-aide-memoire|aide-mémoire]].

---
title: Présentation, installation et exploitation
description: Greenplum Database et MonetDB — bases analytiques : Greenplum (MPP dérivée de PostgreSQL, coordinateur et segments, distribution des tables, fermeture du code source par Broadcom en 2024, forks libres Apache Cloudberry et WarehousePG, gpstate, gpstart, gpstop, gpbackup) et MonetDB (MPL 2.0, pionnière du stockage en colonnes, installation Debian/Ubuntu, RHEL, Windows, macOS, monetdbd, monetdb, mclient, sauvegarde msqldump), cas d'usage et alternatives.
tags: [greenplum, cloudberry, monetdb, mpp, analytique, postgresql, colonnes]
icon: info
---

## Greenplum et ses forks

**Greenplum** distribue [[02-postgresql/01-presentation|PostgreSQL]] sur un **coordinateur** et de nombreux **segments** (MPP) pour l'entrepôt de données. En 2024, **Broadcom** (après le rachat de VMware) a fermé le code source : les nouvelles versions sont propriétaires. Deux forks libres reprennent la base communautaire :

| Projet | Statut |
| --- | --- |
| **Apache Cloudberry** | Fork de Greenplum 7 (PostgreSQL 14), incubé à la fondation Apache |
| **WarehousePG** | Fork de Greenplum 6/7 maintenu par EDB |

Les outils d'administration (`gp*`) sont communs :

```bash
gpstate -s                       # état du coordinateur et des segments
gpstop -a ; gpstart -a ; gpstop -r -a      # arrêt, démarrage, redémarrage
gpstate -e                       # segments en erreur ou en mode non synchronisé
gprecoverseg -a                  # récupérer des segments défaillants
gpbackup --dbname dwh --backup-dir /sauv/gp ; gprestore --timestamp 20261102010000 --backup-dir /sauv/gp
```

```sql
CREATE TABLE ventes (id bigint, client_id int, montant numeric, jour date) DISTRIBUTED BY (client_id)
PARTITION BY RANGE (jour) (START ('2026-01-01') END ('2027-01-01') EVERY (INTERVAL '1 month'));
SELECT gp_segment_id, count(*) FROM ventes GROUP BY 1;     -- vérifier l'équilibre de la distribution
```

## MonetDB

**MonetDB** (MPL 2.0, CWI) a inventé une grande partie des techniques de stockage en colonnes ; base SQL analytique légère, mono-serveur.

```bash
# Debian/Ubuntu : dépôt dev.monetdb.org (clé et sources selon la documentation), puis
sudo apt install monetdb5-sql monetdb-client
sudo systemctl enable --now monetdbd
monetdb create dwh && monetdb release dwh       # créer puis rendre disponible la base
mclient -u monetdb -d dwh                       # mot de passe initial « monetdb » : le changer
msqldump -d dwh > /sauv/dwh.sql
```

RHEL : dépôt `dev.monetdb.org` ; Windows : installeur MSI ; macOS : `brew install monetdb`. Port **50000**.

```sql
ALTER USER "monetdb" WITH PASSWORD 'MdpMonet2026' USING OLD PASSWORD 'monetdb';
COPY INTO ventes FROM '/srv/import/ventes.csv' ON SERVER USING DELIMITERS ',', E'\n', '"';
```

Alternatives modernes à considérer : [[24-clickhouse/01-presentation-installation|ClickHouse]], [[11-duckdb/01-presentation-utilisation|DuckDB]]. Commandes : [[90-aide-memoire|aide-mémoire]].

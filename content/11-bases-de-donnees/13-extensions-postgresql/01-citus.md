---
title: Citus
description: Citus — extension libre (AGPL, Microsoft) qui distribue PostgreSQL sur plusieurs nœuds : architecture coordinateur et workers, tables distribuées, de référence et locales, choix de la clé de distribution (multi-locataire, temps réel), installation (dépôt Citus pour Debian, Ubuntu et RHEL, Docker, Azure), shared_preload_libraries, ajout de nœuds, create_distributed_table, colocalisation, rééquilibrage, haute disponibilité avec Patroni, requêtes parallèles et limites.
tags: [citus, postgresql, distribué, sharding, multi-tenant, extension]
icon: info
---

**Citus** transforme un groupe de serveurs [[02-postgresql/01-presentation|PostgreSQL]] en une base **distribuée** : le **coordinateur** reçoit les requêtes et les répartit sur des **workers** qui stockent des fragments (*shards*) des tables. Les applications restent en SQL PostgreSQL standard. Cas typiques : SaaS multi-locataire (clé `tenant_id`), tableaux de bord temps réel sur de gros volumes.

## Installation (chaque nœud)

```bash
# Debian/Ubuntu : dépôt Citus (packagecloud) puis paquet lié à la version de PostgreSQL
curl https://install.citusdata.com/community/deb.sh | sudo bash
apt search citus | grep postgresql-17          # repérer le nom exact, par ex. postgresql-17-citus-13.0
sudo apt install postgresql-17-citus-13.0
# RHEL : curl https://install.citusdata.com/community/rpm.sh | sudo bash, puis dnf install citus13_17
echo "shared_preload_libraries = 'citus'" | sudo tee -a /etc/postgresql/17/main/postgresql.conf
sudo systemctl restart postgresql
sudo -u postgres psql -d app -c 'CREATE EXTENSION citus;'
```

Windows et macOS : pas de paquets serveur (Docker `citusdata/citus` pour tester). Les nœuds doivent se joindre sans mot de passe interactif (`pg_hba.conf` + `.pgpass` ou certificats).

## Mise en place

```sql
-- Sur le coordinateur
SELECT citus_set_coordinator_host('10.0.20.30', 5432);
SELECT citus_add_node('10.0.20.31', 5432);
SELECT citus_add_node('10.0.20.32', 5432);
SELECT * FROM citus_get_active_worker_nodes();

CREATE TABLE evenements (tenant_id int, id bigserial, ts timestamptz, donnees jsonb, PRIMARY KEY (tenant_id, id));
SELECT create_distributed_table('evenements', 'tenant_id');      -- répartie par locataire
CREATE TABLE pays (code char(2) PRIMARY KEY, nom text);
SELECT create_reference_table('pays');                           -- copiée sur tous les nœuds
SELECT citus_rebalance_start();                                  -- après ajout d'un worker
SELECT * FROM citus_shards LIMIT 10;
```

> [!TIP]
> Le choix de la **colonne de distribution** est décisif : les jointures et transactions qui portent sur la même valeur restent locales à un nœud. Une mauvaise clé crée des requêtes inter-nœuds lentes.

Haute disponibilité : chaque nœud (coordinateur et workers) répliqué par streaming et piloté par Patroni. Suite : [[02-timescaledb|TimescaleDB]] · [[03-apache-age|Apache AGE]] · [[90-aide-memoire|aide-mémoire]].

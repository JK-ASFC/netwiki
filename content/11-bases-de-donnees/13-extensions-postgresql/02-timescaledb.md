---
title: TimescaleDB
description: TimescaleDB — extension PostgreSQL pour les séries temporelles (métriques, IoT, supervision) : licences (Apache 2.0 et Timescale License), installation (dépôt packagecloud pour Debian, Ubuntu et RHEL, Windows, macOS Homebrew, Docker), timescaledb-tune, hypertables et chunks, compression en colonnes, politiques de rétention et de compression, agrégats continus, time_bucket, intégration Grafana et Prometheus (Promscale abandonné), sauvegarde et mises à jour de l'extension.
tags: [timescaledb, postgresql, séries temporelles, métriques, hypertable, grafana]
icon: info
---

**TimescaleDB** ajoute à [[02-postgresql/01-presentation|PostgreSQL]] les **hypertables** : des tables découpées automatiquement en tranches de temps (*chunks*), compressées, purgées et agrégées par des politiques. On garde tout le SQL de PostgreSQL (jointures avec l'inventaire, index, extensions) pour des données de supervision ou d'IoT.

## Installation

```bash
# Debian/Ubuntu
sudo apt install gnupg postgresql-common apt-transport-https lsb-release wget
echo "deb https://packagecloud.io/timescale/timescaledb/$(. /etc/os-release; echo $ID)/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/timescaledb.list
wget -qO- https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg
sudo apt update && sudo apt install timescaledb-2-postgresql-17
sudo timescaledb-tune --yes            # ajoute shared_preload_libraries et règle la mémoire
sudo systemctl restart postgresql
sudo -u postgres psql -d supervision -c 'CREATE EXTENSION IF NOT EXISTS timescaledb;'
```

| Système | Méthode |
| --- | --- |
| RHEL/Rocky/Alma | Dépôt `timescale_timescaledb` (packagecloud) puis `dnf install timescaledb-2-postgresql-17` |
| Windows | Archive ZIP officielle + `setup.exe` (pour une installation PostgreSQL existante) |
| macOS | `brew tap timescale/tap && brew install timescaledb` |
| Docker | `timescale/timescaledb:latest-pg17` |

## Hypertables et politiques

```sql
CREATE TABLE mesures (horodatage timestamptz NOT NULL, equipement text NOT NULL, cpu double precision, debit_in bigint);
SELECT create_hypertable('mesures', by_range('horodatage', INTERVAL '1 day'));
-- Compression des tranches de plus de 7 jours, segmentée par équipement
ALTER TABLE mesures SET (timescaledb.compress, timescaledb.compress_segmentby = 'equipement');
SELECT add_compression_policy('mesures', INTERVAL '7 days');
-- Rétention : supprimer au-delà de 13 mois
SELECT add_retention_policy('mesures', INTERVAL '13 months');
-- Agrégat continu horaire
CREATE MATERIALIZED VIEW mesures_horaire WITH (timescaledb.continuous) AS
  SELECT time_bucket('1 hour', horodatage) AS heure, equipement, avg(cpu) AS cpu_moy, max(debit_in) AS debit_max
  FROM mesures GROUP BY heure, equipement;
SELECT add_continuous_aggregate_policy('mesures_horaire', start_offset => INTERVAL '3 hours', end_offset => INTERVAL '1 hour', schedule_interval => INTERVAL '30 minutes');
SELECT * FROM timescaledb_information.jobs;
```

Les fonctions avancées (compression, agrégats continus) relèvent de la *Timescale License* (gratuite en auto-hébergement, interdite en service géré revendu). Visualisation : [[03-grafana/01-presentation-installation|Grafana]] (source PostgreSQL). Mise à jour de l'extension après celle du paquet : `ALTER EXTENSION timescaledb UPDATE;` (connexion `psql -X`).

Suite : [[03-apache-age|Apache AGE]] · [[90-aide-memoire|aide-mémoire]].

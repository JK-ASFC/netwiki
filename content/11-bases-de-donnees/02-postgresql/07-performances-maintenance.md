---
title: Performances et maintenance (VACUUM, index, EXPLAIN)
description: Comprendre et régler VACUUM et l'autovacuum (versions mortes, gonflement, rebouclage des identifiants de transaction), statistiques ANALYZE, choisir et maintenir les index (B-tree, GIN, BRIN, REINDEX CONCURRENTLY), lire un plan EXPLAIN ANALYZE, trouver les requêtes coûteuses avec pg_stat_statements, verrous et partitionnement.
tags: [postgresql, vacuum, autovacuum, index, explain, pg_stat_statements, performances, partitionnement]
icon: gauge
---

## VACUUM et autovacuum

Avec MVCC, chaque `UPDATE`/`DELETE` laisse une **version morte** de la ligne. `VACUUM` rend cet espace réutilisable et « gèle » les anciennes lignes pour éviter le **rebouclage des identifiants de transaction** (sur 32 bits).

| Opération | Effet |
| --- | --- |
| `VACUUM` | Nettoie les versions mortes (sans bloquer les lectures/écritures) |
| `VACUUM (ANALYZE)` | + met à jour les statistiques |
| `VACUUM FULL` | Réécrit la table (récupère l'espace disque) mais **verrou exclusif** : à éviter en production (préférer `pg_repack`) |
| `ANALYZE` | Statistiques pour l'optimiseur |

```sql
-- Tables avec le plus de lignes mortes et dernier passage de l'autovacuum
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum, last_autoanalyze
FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 10;

-- Âge des identifiants de transaction (alerte au-delà de ~1 milliard)
SELECT datname, age(datfrozenxid) FROM pg_database ORDER BY 2 DESC;
```

### Régler l'autovacuum

```pgconf
autovacuum_max_workers = 5
autovacuum_naptime = 30s
autovacuum_vacuum_scale_factor = 0.05        # défaut 0.2 : trop tardif sur les grosses tables
autovacuum_analyze_scale_factor = 0.02
autovacuum_vacuum_cost_limit = 2000          # laisse travailler l'autovacuum plus vite (SSD)
```

```sql
-- Réglage par table (table très modifiée)
ALTER TABLE app.sessions SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000);
```

> [!WARNING]
> Une **transaction ouverte très longtemps** (session `idle in transaction`, réplica avec `hot_standby_feedback`, slot de réplication logique abandonné) empêche le nettoyage de toutes les tables : gonflement et, à terme, risque de rebouclage. Surveillez `pg_stat_activity` et fixez `idle_in_transaction_session_timeout`.

## Index

| Type | Usage |
| --- | --- |
| **B-tree** (défaut) | Égalité, plages, tri |
| **GIN** | `JSONB`, tableaux, recherche plein texte (`tsvector`), trigrammes (`pg_trgm` pour `LIKE '%…%'`) |
| GiST / SP-GiST | Géométrie (PostGIS), plages, plus proches voisins |
| **BRIN** | Très grandes tables naturellement ordonnées (horodatage) : index minuscule |
| Hash | Égalité seule |

```sql
CREATE INDEX CONCURRENTLY idx_commandes_client ON app.commandes (client_id, date_commande DESC);
CREATE INDEX CONCURRENTLY idx_commandes_ouvertes ON app.commandes (client_id) WHERE statut = 'ouverte';   -- index partiel
CREATE INDEX CONCURRENTLY idx_clients_donnees ON app.clients USING gin (donnees jsonb_path_ops);
REINDEX INDEX CONCURRENTLY app.idx_commandes_client;

-- Index jamais utilisés
SELECT relname, indexrelname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes WHERE idx_scan = 0 ORDER BY pg_relation_size(indexrelid) DESC;
```

`CONCURRENTLY` évite de bloquer les écritures pendant la création (plus long, hors transaction).

## Lire un plan

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM app.commandes WHERE client_id = 42 ORDER BY date_commande DESC LIMIT 20;
```

| Nœud du plan | Signification |
| --- | --- |
| `Seq Scan` | Lecture complète de la table (normal pour une petite table ou une grande proportion de lignes) |
| `Index Scan` / `Index Only Scan` | Accès par index (`Only` : sans lire la table) |
| `Bitmap Heap Scan` | Combinaison d'index, nombreuses lignes |
| `Nested Loop` / `Hash Join` / `Merge Join` | Méthodes de jointure |
| `rows=1000 (actual rows=250000)` | **Estimation fausse** → statistiques obsolètes (`ANALYZE`) ou corrélation de colonnes (`CREATE STATISTICS`) |
| `Buffers: shared read=…` | Pages lues sur disque (et non en cache) |

Des visualiseurs (explain.depesz.com, explain.dalibo.com) facilitent la lecture des plans complexes.

## pg_stat_statements

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
SELECT round(total_exec_time::numeric, 0) AS total_ms, calls,
       round(mean_exec_time::numeric, 1) AS moyenne_ms, rows, left(query, 80) AS requete
FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
SELECT pg_stat_statements_reset();
```

Optimisez d'abord les requêtes au **temps total** le plus élevé (fréquence × durée), pas seulement les plus lentes.

## Activité et verrous

```sql
SELECT pid, usename, datname, state, wait_event_type, wait_event, now() - query_start AS duree, left(query, 60)
FROM pg_stat_activity WHERE state <> 'idle' ORDER BY duree DESC;

-- Qui bloque qui
SELECT pid, pg_blocking_pids(pid) AS bloque_par, left(query, 60) FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid)) > 0;

SELECT pg_cancel_backend(12345);      -- annuler la requête
SELECT pg_terminate_backend(12345);   -- fermer la connexion
```

```pgconf
statement_timeout = '5min'                     # par rôle de préférence : ALTER ROLE app SET statement_timeout = '30s';
lock_timeout = '10s'
idle_in_transaction_session_timeout = '10min'
```

## Partitionnement

```sql
CREATE TABLE app.mesures (
    capteur_id int, horodatage timestamptz NOT NULL, valeur numeric
) PARTITION BY RANGE (horodatage);
CREATE TABLE app.mesures_2025_10 PARTITION OF app.mesures FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
-- Purge d'un mois entier sans VACUUM :
DROP TABLE app.mesures_2024_10;
```

L'extension `pg_partman` automatise la création et la rétention des partitions ; TimescaleDB le fait pour les séries temporelles.

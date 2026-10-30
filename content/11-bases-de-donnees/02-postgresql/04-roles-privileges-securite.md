---
title: Rôles, privilèges et sécurité
description: Modèle de sécurité PostgreSQL — rôles et groupes, attributs (LOGIN, SUPERUSER, CREATEDB, REPLICATION), privilèges sur bases, schémas, tables et séquences, changement du schéma public depuis PostgreSQL 15, privilèges par défaut, rôles prédéfinis (pg_read_all_data, pg_monitor), Row Level Security, audit pgaudit et durcissement.
tags: [postgresql, rôles, privilèges, grant, rls, pgaudit, sécurité, schéma public]
icon: shield-check
---

## Rôles

Un **rôle** est à la fois utilisateur et groupe : un rôle avec `LOGIN` peut se connecter, un rôle sans `LOGIN` sert de groupe.

```sql
CREATE ROLE lecture_app NOLOGIN;
CREATE ROLE ecriture_app NOLOGIN;
CREATE ROLE app_web LOGIN PASSWORD 'MotDePasseLong!' CONNECTION LIMIT 50 IN ROLE ecriture_app;
CREATE ROLE alice LOGIN IN ROLE lecture_app;               -- mot de passe vérifié par LDAP (pg_hba)
ALTER ROLE app_web VALID UNTIL '2026-12-31';
\du
```

| Attribut | Effet |
| --- | --- |
| `LOGIN` | Peut se connecter |
| `SUPERUSER` | Contourne toutes les vérifications : réservé à l'administration |
| `CREATEDB` / `CREATEROLE` | Créer des bases / des rôles |
| `REPLICATION` | Connexion de réplication (et `pg_basebackup`) |
| `BYPASSRLS` | Ignore la sécurité au niveau des lignes |
| `CONNECTION LIMIT` | Nombre maximal de connexions simultanées |

## Privilèges

```sql
-- Base : empêcher la connexion par défaut de PUBLIC, puis l'accorder aux groupes
REVOKE ALL ON DATABASE app FROM PUBLIC;
GRANT CONNECT ON DATABASE app TO lecture_app, ecriture_app;

-- Schéma
GRANT USAGE ON SCHEMA app TO lecture_app, ecriture_app;

-- Objets existants
GRANT SELECT ON ALL TABLES IN SCHEMA app TO lecture_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO ecriture_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO ecriture_app;

-- Objets futurs créés par le propriétaire « app »
ALTER DEFAULT PRIVILEGES FOR ROLE app IN SCHEMA app GRANT SELECT ON TABLES TO lecture_app;
ALTER DEFAULT PRIVILEGES FOR ROLE app IN SCHEMA app GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ecriture_app;
ALTER DEFAULT PRIVILEGES FOR ROLE app IN SCHEMA app GRANT USAGE, SELECT ON SEQUENCES TO ecriture_app;

\dp app.*            -- privilèges sur les tables
\ddp                 -- privilèges par défaut
```

> [!IMPORTANT]
> Depuis **PostgreSQL 15**, `PUBLIC` ne peut plus créer d'objets dans le schéma `public` : une application qui créait ses tables dans `public` avec un rôle non propriétaire reçoit `permission denied for schema public`. Créez un schéma dédié appartenant à l'application, ou rendez son rôle propriétaire de la base.

## Propriété des objets

Le **propriétaire** d'un objet a tous les droits dessus (y compris `DROP`). Bonne pratique : un rôle propriétaire `NOLOGIN` (ou utilisé seulement pour les migrations de schéma), et un rôle applicatif distinct avec les seuls droits DML.

```sql
ALTER TABLE app.commandes OWNER TO app;
REASSIGN OWNED BY ancien_role TO app;     -- avant de supprimer un rôle
DROP OWNED BY ancien_role;
DROP ROLE ancien_role;
```

## Rôles prédéfinis

| Rôle | Usage |
| --- | --- |
| `pg_read_all_data` / `pg_write_all_data` | Lecture / écriture de toutes les données (≥ 14) : outils de sauvegarde, d'analyse |
| `pg_monitor` | Supervision (statistiques, `pg_stat_*`) sans être superutilisateur |
| `pg_signal_backend` | Annuler ou terminer les requêtes d'autres rôles (non superutilisateurs) |
| `pg_checkpoint` | Déclencher un `CHECKPOINT` (≥ 15) |
| `pg_maintain` | `VACUUM`, `ANALYZE`, `REINDEX`… sur toutes les tables (≥ 17) |

```sql
CREATE ROLE supervision LOGIN PASSWORD '…' IN ROLE pg_monitor;
```

## Row Level Security

```sql
ALTER TABLE app.dossiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY dossiers_par_agence ON app.dossiers
  USING (agence = current_setting('app.agence'));
-- L'application positionne la variable à chaque connexion : SET app.agence = 'lyon';
```

Chaque rôle (hors propriétaire et `BYPASSRLS`) ne voit et ne modifie que les lignes autorisées par les politiques.

## Audit (pgaudit)

```bash
sudo apt install postgresql-17-pgaudit       # PGDG ; RHEL : pgaudit_17
```

```pgconf
shared_preload_libraries = 'pg_stat_statements,pgaudit'
pgaudit.log = 'ddl, role, write'
pgaudit.log_relation = on
pgaudit.log_parameter = off
```

```sql
CREATE EXTENSION pgaudit;
```

Les entrées `AUDIT:` apparaissent dans le journal de PostgreSQL ; envoyez-les vers un SIEM.

## Durcissement

- [ ] `listen_addresses` restreint, pare-feu sur 5432
- [ ] `pg_hba.conf` : `hostssl` + `scram-sha-256` (ou cert/gss), `reject` final, pas de `trust`
- [ ] Pas de connexion applicative avec `postgres` ni un superutilisateur
- [ ] `REVOKE ALL ON DATABASE … FROM PUBLIC`, schémas dédiés
- [ ] Mots de passe forts (PostgreSQL ne vérifie pas leur complexité : extension `passwordcheck` ou authentification déléguée LDAP/Kerberos)
- [ ] Mises à jour mineures appliquées (correctifs de sécurité trimestriels)
- [ ] Chiffrement au repos par le système de fichiers (LUKS) ; sauvegardes chiffrées
- [ ] `pgaudit` pour les exigences de traçabilité

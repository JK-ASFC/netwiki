---
title: Configuration et contrôle d'accès
description: Configurer PostgreSQL — postgresql.conf (écoute, connexions, mémoire, WAL, points de contrôle, journalisation), ALTER SYSTEM et rechargement, contrôle d'accès pg_hba.conf (méthodes peer, scram-sha-256, cert, ldap, gss), correspondances pg_ident, TLS et authentification Active Directory (LDAP, Kerberos).
tags: [postgresql, postgresql.conf, pg_hba.conf, scram, tls, ldap, kerberos, active directory]
icon: settings-2
---

## postgresql.conf

```pgconf /etc/postgresql/17/main/conf.d/local.conf
# Connexions
listen_addresses = 'localhost,10.0.30.21'
port = 5432
max_connections = 200
superuser_reserved_connections = 5

# Mémoire (serveur dédié de 32 Go)
shared_buffers = 8GB                    # ~25 % de la RAM
effective_cache_size = 24GB             # estimation du cache disponible (shared_buffers + cache système)
work_mem = 32MB                         # par tri/hachage et par opération : attention au cumul
maintenance_work_mem = 1GB              # VACUUM, CREATE INDEX

# WAL et points de contrôle
wal_level = replica
max_wal_size = 8GB
min_wal_size = 1GB
checkpoint_completion_target = 0.9
wal_compression = zstd                  # PostgreSQL ≥ 15

# Stockage SSD
random_page_cost = 1.1
effective_io_concurrency = 200

# Journalisation
logging_collector = on
log_line_prefix = '%m [%p] %q%u@%d %r '
log_min_duration_statement = 1000       # requêtes de plus d'1 s
log_connections = on
log_disconnections = on
log_lock_waits = on
log_temp_files = 0
log_autovacuum_min_duration = 10s

# Statistiques des requêtes
shared_preload_libraries = 'pg_stat_statements'

# Sécurité
password_encryption = scram-sha-256
ssl = on
ssl_cert_file = '/etc/postgresql/tls/db1.crt'
ssl_key_file = '/etc/postgresql/tls/db1.key'
ssl_min_protocol_version = 'TLSv1.2'
```

PGTune (outil en ligne) propose des valeurs de départ selon la RAM, le nombre de cœurs et le type de charge.

### Appliquer

```sql
ALTER SYSTEM SET work_mem = '64MB';               -- écrit dans postgresql.auto.conf
SELECT pg_reload_conf();                          -- recharger (paramètres « sighup »)
SELECT name, setting, unit, context, pending_restart FROM pg_settings WHERE name IN ('shared_buffers','work_mem');
SHOW config_file;
```

`context = postmaster` signifie qu'un **redémarrage** est nécessaire (ex. `shared_buffers`, `max_connections`, `shared_preload_libraries`).

## pg_hba.conf

Chaque ligne : `TYPE  BASE  UTILISATEUR  ADRESSE  MÉTHODE [options]`. La **première ligne qui correspond** s'applique.

```pghba /etc/postgresql/17/main/pg_hba.conf
# Administration locale par le compte Unix postgres
local   all             postgres                                peer
local   all             all                                     peer

# Application, réseau des serveurs web, TLS obligatoire
hostssl app             app             10.0.20.0/24            scram-sha-256

# Lecture des rapports par les comptes AD (LDAP en liaison directe)
hostssl rapports        +lecteurs_ad    10.0.0.0/8              ldap ldapurl="ldaps://dc1.corp.exemple.fr/DC=corp,DC=exemple,DC=fr?sAMAccountName?sub" ldapbinddn="CN=svc_pg,OU=Services,DC=corp,DC=exemple,DC=fr" ldapbindpasswd="…"

# Réplication
hostssl replication     replicateur     10.0.30.22/32           scram-sha-256

# Certificats clients (outils d'automatisation)
hostssl all             +admins_cert    10.0.99.0/24            cert

# Tout le reste est refusé
host    all             all             0.0.0.0/0               reject
host    all             all             ::/0                    reject
```

| Méthode | Principe |
| --- | --- |
| `peer` | Le nom du compte Unix doit correspondre au rôle (connexions locales) |
| **`scram-sha-256`** | Mot de passe, protocole à défi (recommandé) ; `md5` est obsolète |
| `cert` | Certificat client ; le CN correspond au rôle (ou via `pg_ident.conf`) |
| `ldap` | Vérification du mot de passe auprès d'un annuaire (AD) ; le rôle doit **exister** dans PostgreSQL |
| `gss` | Kerberos (SSO avec Active Directory) |
| `reject` | Refus explicite |

`+groupe` désigne les membres d'un rôle groupe. Rechargez après modification :

```sql
SELECT pg_reload_conf();
SELECT line_number, type, database, user_name, address, auth_method FROM pg_hba_file_rules;   -- contrôle de syntaxe
```

## pg_ident.conf

Associe une identité externe (compte Unix, CN de certificat, principal Kerberos) à un rôle :

```text /etc/postgresql/17/main/pg_ident.conf
# MAPNAME     SYSTEM-USERNAME              PG-USERNAME
kerberos      /^(.*)@CORP\.EXEMPLE\.FR$    \1
sauvegarde    backup                       postgres
```

```pghba
local   all   postgres                 peer map=sauvegarde
hostssl all   all       10.0.0.0/8     gss include_realm=1 map=kerberos krb_realm=CORP.EXEMPLE.FR
```

Kerberos nécessite un keytab contenant `postgres/db1.corp.exemple.fr@CORP.EXEMPLE.FR` (`krb_server_keyfile` dans `postgresql.conf`).

## TLS côté client

```bash
psql "host=db1.corp.exemple.fr dbname=app user=app sslmode=verify-full sslrootcert=/etc/ssl/certs/ac-interne.crt"
```

| `sslmode` | Protection |
| --- | --- |
| `require` | Chiffré, certificat non vérifié |
| `verify-ca` | Certificat signé par l'AC attendue |
| **`verify-full`** | + nom d'hôte vérifié (recommandé) |

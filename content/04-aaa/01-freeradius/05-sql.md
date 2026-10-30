---
title: Base SQL (MariaDB / PostgreSQL)
description: Stocker utilisateurs, groupes, attributs, NAS et comptabilité dans MariaDB ou PostgreSQL — schéma, module rlm_sql, tables radcheck/radreply/radusergroup, clients dynamiques, compteurs (sqlcounter), sessions simultanées, interface daloRADIUS et haute disponibilité.
tags: [freeradius, sql, mariadb, mysql, postgresql, radcheck, sqlcounter, daloradius]
icon: database
---

## Préparer la base (MariaDB)

```bash
sudo apt install mariadb-server freeradius-mysql      # RHEL : mariadb-server freeradius-mysql
sudo mysql_secure_installation
sudo mysql <<'EOF'
CREATE DATABASE radius CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'radius'@'localhost' IDENTIFIED BY 'MotDePasseRadiusDB';
GRANT SELECT, INSERT, UPDATE, DELETE ON radius.* TO 'radius'@'localhost';
FLUSH PRIVILEGES;
EOF
# Schéma fourni avec FreeRADIUS
sudo mysql radius < /etc/freeradius/3.0/mods-config/sql/main/mysql/schema.sql
sudo mysql radius < /etc/freeradius/3.0/mods-config/sql/main/mysql/setup.sql   # optionnel (crée aussi l'utilisateur)
```

PostgreSQL : schéma dans `mods-config/sql/main/postgresql/schema.sql`, `dialect = "postgresql"`, `driver = "rlm_sql_postgresql"`.

## Tables

| Table | Contenu |
| --- | --- |
| `radcheck` | Attributs de **contrôle** par utilisateur (mot de passe, conditions) |
| `radreply` | Attributs de **réponse** par utilisateur |
| `radusergroup` | Appartenance utilisateur → groupe (avec priorité) |
| `radgroupcheck` | Contrôles par groupe |
| `radgroupreply` | Réponses par groupe (VLAN, Session-Timeout…) |
| `radacct` | Comptabilité (sessions) |
| `radpostauth` | Journal des authentifications (succès/échecs) |
| `nas` | Clients RADIUS (NAS) dynamiques |
| `nasreload` | Signalement de rechargement des NAS |

Chaque ligne de `radcheck`/`radreply` : `username`, `attribute`, `op`, `value`.

## Configurer le module

```radius mods-available/sql
sql {
    dialect = "mysql"
    driver = "rlm_sql_${dialect}"

    mysql {
        # Connexion chiffrée vers un serveur distant
        # tls {
        #     ca_file = "/etc/ssl/certs/ca-db.pem"
        #     tls_required = yes
        # }
        warnings = auto
    }

    server = "localhost"
    port = 3306
    login = "radius"
    password = "MotDePasseRadiusDB"
    radius_db = "radius"

    acct_table1 = "radacct"
    acct_table2 = "radacct"
    postauth_table = "radpostauth"
    authcheck_table = "radcheck"
    groupcheck_table = "radgroupcheck"
    authreply_table = "radreply"
    groupreply_table = "radgroupreply"
    usergroup_table = "radusergroup"

    delete_stale_sessions = yes
    read_groups = yes
    read_profiles = yes

    # Clients (NAS) lus depuis la table « nas » au démarrage
    read_clients = yes
    client_table = "nas"

    pool {
        start = ${thread[pool].start_servers}
        min = ${thread[pool].min_spare_servers}
        max = ${thread[pool].max_servers}
        spare = ${thread[pool].max_spare_servers}
        uses = 0
        retry_delay = 30
        lifetime = 0
        idle_timeout = 60
    }

    group_attribute = "SQL-Group"
    $INCLUDE ${modconfdir}/${.:name}/main/${dialect}/queries.conf
}
```

```bash
cd /etc/freeradius/3.0
sudo ln -s ../mods-available/sql mods-enabled/sql
sudo chgrp -h freerad mods-enabled/sql
```

Puis **décommenter `sql`** dans `sites-enabled/default` (sections `authorize`, `accounting`, `session`, `post-auth`) et dans `sites-enabled/inner-tunnel` (`authorize`, `session`, `post-auth`) — le mot-clé y est présent précédé de `-sql` ou `#sql`.

> [!NOTE]
> Le préfixe `-` devant un module (`-sql`) signifie « appeler ce module s'il est chargé, sinon ignorer » : pratique pour une configuration commune à plusieurs serveurs.

## Gérer les utilisateurs et les groupes

```sql
-- Utilisateur avec mot de passe (clair : compatible avec toutes les méthodes)
INSERT INTO radcheck (username, attribute, op, value) VALUES ('alice', 'Cleartext-Password', ':=', 'Mot2Passe!');
-- Hash NT (PEAP-MSCHAPv2 sans stocker le clair)
INSERT INTO radcheck (username, attribute, op, value) VALUES ('bruno', 'NT-Password', ':=', '0x8846F7EAEE8FB117AD06BDD830B7586C');
-- Date d'expiration du compte (module expiration)
INSERT INTO radcheck (username, attribute, op, value) VALUES ('stagiaire1', 'Expiration', ':=', '30 Jun 2026 18:00');
-- Une seule session simultanée
INSERT INTO radcheck (username, attribute, op, value) VALUES ('alice', 'Simultaneous-Use', ':=', '1');

-- Groupes
INSERT INTO radusergroup (username, groupname, priority) VALUES ('alice', 'employes', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('stagiaire1', 'invites', 1);

-- Attributs par groupe : VLAN dynamique
INSERT INTO radgroupreply (groupname, attribute, op, value) VALUES
 ('employes', 'Tunnel-Type', ':=', 'VLAN'),
 ('employes', 'Tunnel-Medium-Type', ':=', 'IEEE-802'),
 ('employes', 'Tunnel-Private-Group-Id', ':=', '40'),
 ('invites',  'Tunnel-Type', ':=', 'VLAN'),
 ('invites',  'Tunnel-Medium-Type', ':=', 'IEEE-802'),
 ('invites',  'Tunnel-Private-Group-Id', ':=', '50'),
 ('invites',  'Session-Timeout', ':=', '14400');

-- Condition de groupe : les invités seulement en Wi-Fi
INSERT INTO radgroupcheck (groupname, attribute, op, value) VALUES ('invites', 'NAS-Port-Type', '==', 'Wireless-802.11');
```

Ordre de traitement : `radcheck` (utilisateur) → `radreply` → pour chaque groupe par priorité : `radgroupcheck` puis `radgroupreply` (si les contrôles correspondent). `Fall-Through` dans `radreply` / `radgroupreply` permet de continuer vers le groupe suivant.

Test :

```bash
radtest alice 'Mot2Passe!' 127.0.0.1 0 testing123
# Attendu : Access-Accept avec Tunnel-Private-Group-Id = "40"
```

## Clients dynamiques (table nas)

```sql
INSERT INTO nas (nasname, shortname, type, secret, description)
VALUES ('10.0.1.21', 'sw-etage2', 'cisco', 'SecretSwitchEtage2', 'Switch accès 2e étage');
```

Avec `read_clients = yes`, les NAS sont chargés **au démarrage** : redémarrez FreeRADIUS après un ajout (ou utilisez le site `dynamic-clients` pour un chargement à la volée).

## Comptabilité

Avec `sql` dans la section `accounting`, chaque Start / Interim-Update / Stop alimente `radacct`.

```sql
-- Sessions en cours
SELECT username, nasipaddress, framedipaddress, callingstationid, acctstarttime
FROM radacct WHERE acctstoptime IS NULL ORDER BY acctstarttime DESC;

-- Volume par utilisateur sur 30 jours (Go)
SELECT username, ROUND(SUM(acctinputoctets + acctoutputoctets)/1024/1024/1024, 2) AS go
FROM radacct WHERE acctstarttime > NOW() - INTERVAL 30 DAY GROUP BY username ORDER BY go DESC LIMIT 20;

-- Derniers échecs d'authentification
SELECT username, reply, authdate FROM radpostauth WHERE reply = 'Access-Reject' ORDER BY authdate DESC LIMIT 50;
```

> [!WARNING]
> `radacct` et `radpostauth` grossissent indéfiniment : planifiez une **purge** ou un archivage (événement MariaDB ou tâche cron) et des index adaptés. Les sessions restées « ouvertes » après un redémarrage du NAS se ferment avec `Accounting-On/Off` (requêtes `accounting_onoff_query`).

## Sessions simultanées

```radius sites-enabled/default (extrait)
session {
    sql
}
```

Avec `Simultaneous-Use := 1`, une seconde connexion du même utilisateur est refusée tant que la première est ouverte dans `radacct` (nécessite un accounting fiable ; `checkrad` peut interroger le NAS pour vérifier).

## Compteurs : limiter le temps ou le volume (sqlcounter)

```radius mods-available/sqlcounter (extrait)
sqlcounter dailycounter {
    sql_module_instance = sql
    dialect = ${modules.sql.dialect}
    counter_name = Daily-Session-Time
    check_name = Max-Daily-Session
    reply_name = Session-Timeout
    key = User-Name
    reset = daily
    $INCLUDE ${modconfdir}/sql/counter/${dialect}/${.:instance}.conf
}
```

```bash
sudo ln -s ../mods-available/sqlcounter /etc/freeradius/3.0/mods-enabled/
```

Ajouter `dailycounter` dans `authorize` (après `sql`), puis :

```sql
-- 2 heures par jour pour le groupe invités
INSERT INTO radgroupcheck (groupname, attribute, op, value) VALUES ('invites', 'Max-Daily-Session', ':=', '7200');
```

Autres compteurs livrés : `monthlycounter`, `noresetcounter`, `expire_on_login`. Pour un quota de volume, créez un compteur sur `acctinputoctets + acctoutputoctets`.

## Interface web : daloRADIUS

**daloRADIUS** (PHP) fournit une interface de gestion des utilisateurs, groupes, NAS, cartes prépayées et rapports, directement sur ces tables. Installez-le sur un serveur web séparé ou restreint, en HTTPS, avec un compte SQL dédié.

## Haute disponibilité de la base

- **MariaDB Galera** (multi-primaire) ou réplication primaire/réplique ; chaque FreeRADIUS peut viser un nœud local en lecture.
- Deux instances du module (`sql sql_local { … }`, `sql sql_distant { … }`) dans un bloc `redundant { }`.
- En cas de base indisponible, prévoir un comportement explicite : refuser, ou accepter dans un VLAN restreint (`if (fail) { … }`).

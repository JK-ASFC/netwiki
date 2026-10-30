---
title: Comptes, privilèges et sécurité
description: Gérer les comptes (utilisateur@hôte), privilèges et rôles, plugins d'authentification (unix_socket, caching_sha2_password, ed25519, PAM pour Active Directory), politique de mots de passe, TLS obligatoire, durcissement du serveur, audit des connexions et requêtes, et chiffrement des données au repos.
tags: [mariadb, mysql, utilisateurs, privilèges, rôles, tls, pam, audit, chiffrement]
icon: shield-check
---

## Comptes : utilisateur@hôte

Un compte est le couple **nom + hôte d'origine** : `'app'@'10.0.20.%'` et `'app'@'localhost'` sont deux comptes distincts, avec leurs propres mots de passe et droits.

```sql
CREATE USER 'app'@'10.0.20.%' IDENTIFIED BY 'MotDePasseLong!';
GRANT SELECT, INSERT, UPDATE, DELETE ON app.* TO 'app'@'10.0.20.%';

CREATE USER 'lecture'@'10.0.%' IDENTIFIED BY '…';
GRANT SELECT ON app.* TO 'lecture'@'10.0.%';

SHOW GRANTS FOR 'app'@'10.0.20.%';
SELECT user, host, plugin FROM mysql.user;      -- MariaDB : mysql.global_priv pour le détail
ALTER USER 'app'@'10.0.20.%' IDENTIFIED BY 'NouveauMotDePasse';
DROP USER 'ancien'@'%';
```

| Niveau | Exemple |
| --- | --- |
| Global | `GRANT PROCESS ON *.*` |
| Base | `GRANT ALL ON app.*` |
| Table / colonne | `GRANT SELECT (nom, email) ON app.clients` |
| Routine | `GRANT EXECUTE ON PROCEDURE app.p_facture` |

> [!WARNING]
> Ne donnez jamais `ALL PRIVILEGES ON *.*` ni `GRANT OPTION` à un compte applicatif, et évitez l'hôte `'%'` : listez les réseaux des serveurs d'application. Les privilèges `FILE`, `SUPER`, `PROCESS` sont réservés à l'administration.

## Rôles

```sql
CREATE ROLE lecture_app, ecriture_app;
GRANT SELECT ON app.* TO lecture_app;
GRANT INSERT, UPDATE, DELETE ON app.* TO ecriture_app;
GRANT lecture_app, ecriture_app TO 'app'@'10.0.20.%';
SET DEFAULT ROLE ALL TO 'app'@'10.0.20.%';                 -- MySQL
SET DEFAULT ROLE ecriture_app FOR 'app'@'10.0.20.%';       -- MariaDB (un rôle par défaut)
```

## Plugins d'authentification

| Plugin | Produit | Remarque |
| --- | --- | --- |
| `unix_socket` / `auth_socket` | MariaDB / MySQL (Ubuntu) | Le compte Unix du même nom se connecte par socket sans mot de passe (`sudo mariadb`) |
| `caching_sha2_password` | MySQL (défaut) | SHA-256 ; nécessite TLS ou un échange de clé RSA à la première connexion |
| `mysql_native_password` | Les deux | SHA-1, ancien ; **désactivé par défaut dans MySQL 8.4** |
| `ed25519` / PARSEC | MariaDB | Signatures modernes, le serveur ne stocke pas d'équivalent du mot de passe |
| **PAM** | MariaDB (inclus), Percona Server | Authentification via PAM → SSSD/winbind → **Active Directory** |
| LDAP | MySQL Enterprise | Commercial |

### Comptes Active Directory (MariaDB + PAM)

```sql
INSTALL SONAME 'auth_pam';
CREATE USER 'alice'@'%' IDENTIFIED VIA pam USING 'mariadb';
GRANT SELECT ON rapports.* TO 'alice'@'%';
```

```text /etc/pam.d/mariadb (serveur joint au domaine avec SSSD)
auth     required  pam_sss.so
account  required  pam_sss.so
```

Le compte système doit pouvoir lire `/etc/shadow` uniquement pour `pam_unix` ; avec SSSD, ce n'est pas nécessaire. Les connexions doivent être chiffrées (le mot de passe transite en clair dans le protocole PAM *dialog*).

## Politique de mots de passe

```sql
-- MySQL : composant de validation
INSTALL COMPONENT 'file://component_validate_password';
SET PERSIST validate_password.length = 14;
SET PERSIST validate_password.policy = MEDIUM;
ALTER USER 'app'@'10.0.20.%' PASSWORD EXPIRE INTERVAL 180 DAY FAILED_LOGIN_ATTEMPTS 5 PASSWORD_LOCK_TIME 1;

-- MariaDB : greffons de vérification
INSTALL SONAME 'simple_password_check';
SET GLOBAL simple_password_check_minimal_length = 14;
```

## TLS

```mycnf
[mysqld]
ssl_cert = /etc/mysql/tls/db1.crt
ssl_key  = /etc/mysql/tls/db1.key
ssl_ca   = /etc/mysql/tls/ca.crt
require_secure_transport = ON          # refuse toute connexion TCP non chiffrée
tls_version = TLSv1.2,TLSv1.3
```

```sql
ALTER USER 'app'@'10.0.20.%' REQUIRE SSL;                 -- ou REQUIRE X509 (certificat client)
SHOW VARIABLES LIKE '%ssl%';
SHOW STATUS LIKE 'Ssl_cipher';                            -- chiffrement de la session courante
```

MySQL génère des certificats auto-signés au premier démarrage ; MariaDB ≥ 11.4 active TLS par défaut. Côté client : `--ssl-mode=VERIFY_IDENTITY` (MySQL) / `--ssl-verify-server-cert` (MariaDB) pour vérifier le certificat du serveur.

## Durcissement

- [ ] `bind-address` sur l'interface utile, pare-feu limité aux serveurs d'application
- [ ] Pas de root distant, pas d'utilisateur anonyme, pas de base `test`
- [ ] `local_infile = OFF`, `secure_file_priv` sur un répertoire dédié (ou vide pour interdire)
- [ ] `skip-name-resolve` et droits par adresses IP
- [ ] Un compte par application, privilèges minimaux, rôles
- [ ] TLS obligatoire hors du serveur local
- [ ] Mises à jour mineures appliquées régulièrement
- [ ] Sauvegardes chiffrées et testées

## Audit

```sql
-- MariaDB : greffon d'audit inclus
INSTALL SONAME 'server_audit';
SET GLOBAL server_audit_events = 'CONNECT,QUERY_DDL,QUERY_DCL';
SET GLOBAL server_audit_output_type = 'syslog';
SET GLOBAL server_audit_logging = ON;
```

Pour MySQL Community, le greffon d'audit libre de **Percona** (`audit_log_filter`) ou des journaux généraux ciblés ; l'audit natif est réservé à l'édition Enterprise.

## Chiffrement au repos

| Produit | Mise en œuvre |
| --- | --- |
| MariaDB | Greffon `file_key_management` (clés dans un fichier chiffré) ou Hashicorp Vault ; `innodb_encrypt_tables = ON`, `encrypt_binlog = ON` |
| MySQL | Composant *keyring* (`component_keyring_file`) ; `ALTER TABLE … ENCRYPTION='Y'`, `default_table_encryption`, chiffrement des binlogs et du redo |
| Les deux | Chiffrement du volume (LUKS) : simple, protège contre le vol de disques |

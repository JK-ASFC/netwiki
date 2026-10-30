---
title: pgAdmin et MySQL Workbench
description: Consoles graphiques dédiées — pgAdmin 4 pour PostgreSQL (mode bureau et mode serveur web, installation Docker et paquets, authentification LDAP/OAuth, tableau de bord, outil de requête et plans graphiques, sauvegarde et restauration pg_dump, gestion des rôles, sécurité) et MySQL Workbench (modélisation, administration, migration, compatibilité limitée avec MariaDB et alternatives HeidiSQL ou DBeaver).
tags: [pgadmin, postgresql, mysql workbench, mysql, mariadb, administration, client]
icon: database
---

## pgAdmin 4

**pgAdmin 4** (licence PostgreSQL) est la console d'administration officielle de [[02-postgresql/01-presentation|PostgreSQL]].

| Mode | Usage |
| --- | --- |
| **Bureau** | Application locale (Windows, macOS, Linux) pour un administrateur |
| **Serveur** (web) | Application web partagée : plusieurs utilisateurs, authentification centralisée, accès depuis un navigateur |

```bash
# Linux (dépôt officiel) : mode bureau et/ou web
sudo apt install pgadmin4-desktop      # ou pgadmin4-web, puis : sudo /usr/pgadmin4/bin/setup-web.sh
```

```yaml compose.yaml (mode serveur)
services:
  pgadmin:
    image: dpage/pgadmin4:9
    environment:
      PGADMIN_DEFAULT_EMAIL: dba@corp.exemple.fr
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_MDP}
      PGADMIN_CONFIG_AUTHENTICATION_SOURCES: "['ldap', 'internal']"
      PGADMIN_CONFIG_LDAP_SERVER_URI: "'ldaps://dc01.corp.exemple.fr:636'"
      PGADMIN_CONFIG_LDAP_SEARCH_BASE_DN: "'OU=Utilisateurs,DC=corp,DC=exemple,DC=fr'"
      PGADMIN_CONFIG_LDAP_USERNAME_ATTRIBUTE: "'sAMAccountName'"
    ports: ["127.0.0.1:5050:80"]
    volumes: ["./donnees:/var/lib/pgadmin"]
    restart: unless-stopped
```

```powershell
winget install PostgreSQL.pgAdmin          # Windows ; macOS : brew install --cask pgadmin4
```

| Fonction | Usage |
| --- | --- |
| Tableau de bord | Sessions, transactions, verrous, E/S ; terminer une session bloquante |
| **Outil de requête** | Éditeur SQL, **EXPLAIN graphique**, historique |
| Sauvegarde / restauration | Interface pour `pg_dump` / `pg_restore` (formats personnalisé, répertoire, SQL) |
| Rôles et droits | Création des rôles, assistant d'attribution de privilèges |
| ERD, Schema Diff | Diagrammes, comparaison de schémas entre bases |

Sécurité en mode serveur : derrière un reverse proxy HTTPS, authentification **LDAP/OAuth2/Kerberos** + MFA intégrée, mots de passe des serveurs non enregistrés (ou protégés), accès réseau aux bases limité au serveur pgAdmin. Les **connexions** aux serveurs PostgreSQL peuvent passer par un tunnel SSH.

## MySQL Workbench

**MySQL Workbench** (Oracle, GPL) est l'outil graphique de MySQL :

| Module | Usage |
| --- | --- |
| Développement SQL | Éditeur, plans d'exécution visuels, exports |
| **Modélisation** | Diagrammes EER, génération du SQL (*forward engineering*), synchronisation avec une base |
| Administration | État du serveur, utilisateurs et privilèges, variables, journaux, sauvegarde logique (`mysqldump`) |
| Migration | Assistants de migration depuis SQL Server, PostgreSQL, Access… |
| Performance | Tableau de bord, rapports du *Performance Schema* |

```powershell
winget install Oracle.MySQLWorkbench
```

Linux : paquets du dépôt MySQL ; macOS : `.dmg`.

> [!NOTE]
> MySQL Workbench cible **MySQL** : avec **MariaDB**, la connexion fonctionne généralement mais des avertissements de version apparaissent et certaines fonctions d'administration sont incompatibles (les deux moteurs divergent). Pour MariaDB, préférez **HeidiSQL** (Windows), [[07-dbeaver|DBeaver]] ou la ligne de commande — voir [[01-mariadb-mysql/01-presentation|MariaDB / MySQL]].

Bonnes pratiques communes : comptes nominatifs, TLS vers les bases, tunnel SSH pour les serveurs non exposés, pas de mots de passe d'administration enregistrés sur des postes partagés.

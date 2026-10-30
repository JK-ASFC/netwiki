---
title: DBeaver
description: DBeaver, client universel de bases de données (Community libre et éditions commerciales) — installation et déploiement, connexions JDBC (PostgreSQL, MariaDB/MySQL, SQL Server, Oracle, SQLite, MongoDB et Redis en édition payante), tunnel SSH et proxy, TLS, types de connexion (production en lecture seule, confirmation des modifications), éditeur SQL et plans d'exécution, export et import de données, comparaison de schémas, sécurité des identifiants enregistrés et configuration en entreprise.
tags: [dbeaver, base de données, sql, client, jdbc, tunnel ssh, postgresql]
icon: database
---

**DBeaver** est un client graphique **multi-bases** (Windows, macOS, Linux) : un seul outil pour PostgreSQL, MariaDB/MySQL, SQL Server, Oracle, SQLite, ClickHouse, et des dizaines d'autres via JDBC. L'édition **Community** (Apache 2.0) couvre l'essentiel ; les éditions commerciales ajoutent NoSQL (MongoDB, Redis…), outils avancés et gestion d'équipe.

## Installation

```powershell
winget install dbeaver.dbeaver
```

```bash
sudo snap install dbeaver-ce          # ou paquet .deb/.rpm ; macOS : brew install --cask dbeaver-community
```

Les **pilotes JDBC** sont téléchargés à la première connexion ; sur un réseau isolé, préparez un dépôt local de pilotes ou une installation préconfigurée.

## Connexions

| Réglage | Recommandation |
| --- | --- |
| **Tunnel SSH** (onglet SSH) | Atteindre une base qui n'écoute que localement ou dans un réseau protégé, via un bastion (clé SSH) |
| **SSL/TLS** | Activé, vérification du certificat (AC interne) — par exemple `sslmode=verify-full` pour PostgreSQL |
| Authentification | Compte nominatif en lecture par défaut ; comptes d'administration séparés |
| **Type de connexion** | `Production` : couleur rouge, **confirmation** de l'exécution des requêtes, validation automatique désactivée, lecture seule si possible |
| Dossiers | Ranger par environnement (Production, Préproduction, Laboratoire) |

> [!TIP]
> Marquez systématiquement les connexions de production avec le type **Production** (en-tête rouge, confirmation des `UPDATE`/`DELETE`, transactions manuelles) : la plupart des incidents de données viennent d'une requête exécutée dans le mauvais onglet.

## Fonctions utiles

| Fonction | Usage |
| --- | --- |
| Éditeur SQL | Complétion, formatage, exécution d'un script, **plan d'exécution** (`EXPLAIN`) |
| Navigateur d'objets | Tables, index, vues, procédures, rôles, sessions |
| Éditeur de données | Filtrer, trier, modifier (avec validation explicite) |
| **Export / import** | CSV, Excel, JSON, SQL ; migration de données entre bases |
| Diagrammes ER | Vue des relations d'un schéma |
| Comparaison de schémas (éditions payantes / extension) | Préparer une migration |
| Gestionnaire de sessions | Repérer une requête bloquante et l'interrompre |

## Sécurité

- [ ] Mots de passe enregistrés protégés par le **mot de passe maître** (*Preferences → Security*) — par défaut, ils sont chiffrés avec une clé connue
- [ ] Préférer l'authentification intégrée (Kerberos/Windows pour SQL Server) ou ne pas enregistrer les mots de passe de production
- [ ] Ne pas exporter de données personnelles sur le poste sans nécessité (RGPD) ; supprimer les exports
- [ ] Mises à jour régulières (pilotes JDBC inclus)

## En entreprise

Les paramètres et connexions sont dans le **workspace** (`%APPDATA%\DBeaverData\workspace6` sous Windows, `~/.local/share/DBeaverData` sous Linux). Une configuration commune (pilotes, connexions sans mot de passe, préférences) peut être distribuée via `dbeaver.ini` et un workspace modèle. Alternatives spécialisées : [[08-pgadmin-mysql-workbench|pgAdmin et MySQL Workbench]], SSMS pour SQL Server ([[08-sql-server/01-presentation-installation|SQL Server]]).

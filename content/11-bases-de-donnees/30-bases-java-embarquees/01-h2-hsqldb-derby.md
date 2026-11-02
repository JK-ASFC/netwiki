---
title: H2, HSQLDB et Apache Derby
description: Bases SQL Java embarquées — H2 (MPL/EPL), HSQLDB (BSD) et Apache Derby (Apache 2.0, en fin de vie) : où on les trouve (applications Java, outils d'administration, Jira et Confluence en évaluation, Keycloak en développement, LibreOffice Base), modes embarqué, fichier et serveur, URL JDBC, consoles (H2 Console, HSQLDB DatabaseManager, ij), sauvegarde, sécurité (console H2 exposée, CVE), compatibilité des versions de fichiers et migration vers PostgreSQL.
tags: [h2, hsqldb, derby, java, jdbc, embarqué]
icon: info
---

Ces bases s'exécutent **dans le processus Java** de l'application : aucun service à installer, un fichier sur disque. Elles conviennent aux tests et aux petites installations, mais beaucoup d'éditeurs exigent une **vraie base** ([[02-postgresql/01-presentation|PostgreSQL]], [[01-mariadb-mysql/01-presentation|MariaDB]]) en production — c'est souvent la première action après une installation « d'évaluation ».

| Base | Où on la rencontre | Fichiers |
| --- | --- | --- |
| **H2** | Keycloak (mode dev), Spring Boot (tests), Jira/Confluence (évaluation), nombreux outils Java | `*.mv.db` |
| **HSQLDB** | LibreOffice Base, anciennes applications, tests | `*.script`, `*.data`, `*.properties` |
| **Apache Derby** | Anciennes applications Java EE, GlassFish (base intégrée), outils IBM | Répertoire de base (`seg0/`, `log/`) |

> [!NOTE]
> **Apache Derby** n'évolue presque plus et la fondation Apache a engagé son retrait : ne l'utilisez pas pour un nouveau projet et prévoyez la migration des applications qui en dépendent.

## Modes et URL JDBC

```text
jdbc:h2:file:/srv/appli/data/base            # embarqué, fichier (un seul processus)
jdbc:h2:tcp://srv-app:9092//srv/appli/data/base   # mode serveur
jdbc:hsqldb:file:/srv/appli/db/base ; jdbc:hsqldb:hsql://srv-app/base
jdbc:derby:/srv/appli/derbydb;create=true ; jdbc:derby://srv-app:1527/base
```

## Consoles et sauvegarde

```bash
java -cp h2-*.jar org.h2.tools.Server -tcp -tcpPort 9092 -web -webPort 8082   # serveur TCP + console web (http://127.0.0.1:8082)
java -cp h2-*.jar org.h2.tools.Script -url jdbc:h2:file:/srv/appli/data/base -user sa -script /sauv/base.sql   # export SQL
java -cp h2-*.jar org.h2.tools.RunScript -url jdbc:h2:file:/tmp/restaure -user sa -script /sauv/base.sql
java -cp hsqldb-*.jar org.hsqldb.util.DatabaseManagerSwing --url jdbc:hsqldb:file:/srv/appli/db/base
java -cp derbytools.jar:derby.jar org.apache.derby.tools.ij      # ij> CONNECT 'jdbc:derby:/srv/appli/derbydb'; SHOW TABLES;
```

```sql
-- H2 : sauvegarde à chaud (archive ZIP cohérente)
BACKUP TO '/sauv/base-2026-11-02.zip';
-- HSQLDB : sauvegarde en ligne
BACKUP DATABASE TO '/sauv/hsqldb/' BLOCKING;
-- Derby : sauvegarde en ligne
CALL SYSCS_UTIL.SYSCS_BACKUP_DATABASE('/sauv/derby');
```

> [!WARNING]
> La **console web H2** permet d'exécuter du code sur le serveur (elle a fait l'objet de failles critiques) : ne l'exposez jamais, ne l'activez pas en production (`spring.h2.console.enabled=false`), et mettez H2 à jour (2.x). Les fichiers H2 1.4 ne s'ouvrent pas directement en 2.x : export SQL avec l'ancienne version puis import.

Suite : [[02-realm|Realm]] · [[90-aide-memoire|aide-mémoire]].

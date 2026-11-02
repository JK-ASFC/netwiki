---
title: XWiki
description: XWiki (LGPL 2.1) — wiki d'entreprise et plateforme d'applications en Java : pages structurées, applications sans code (App Within Minutes), droits fins, édition WYSIWYG, extensions, LDAP et SSO, export PDF ; installation Docker (images officielles xwiki:stable-postgres-tomcat, -mysql, -mariadb ; variables DB_*), paquets Debian/Ubuntu (dépôt maven.xwiki.org), WAR sur Tomcat (Linux, Windows, macOS), assistant de distribution, configuration xwiki.cfg et xwiki.properties, sauvegarde, mise à jour et dépannage.
tags: [xwiki, wiki, java, tomcat, entreprise, ldap, docker]
icon: book-open-check
---

**XWiki** (LGPL 2.1) est un wiki d'entreprise écrit en **Java** : éditeur WYSIWYG, pages et espaces hiérarchiques, **droits** très fins (par wiki, espace ou page, utilisateur ou groupe), **applications sans code** (*App Within Minutes* : formulaires et tableaux de données), export PDF/ODT, plus de 800 **extensions** (diagrammes, Office, blog, forum), sous-wikis (*fermes*). Il convient aux intranets et bases documentaires d'organisations moyennes à grandes. Alternatives plus légères : [[01-outline-wikijs|Outline, Wiki.js]], [[03-mediawiki-dokuwiki|MediaWiki, DokuWiki]].

Prérequis : Java 17 ou 21 (selon la version), Tomcat 10, PostgreSQL, MySQL ou MariaDB, 2 à 4 Go de RAM pour la JVM.

## Docker (images officielles)

Variantes : `xwiki:stable-postgres-tomcat`, `xwiki:stable-mysql-tomcat`, `xwiki:stable-mariadb-tomcat` (et par numéro de version, par exemple `18-postgres-tomcat`).

```yaml
# compose.yaml
services:
  web:
    image: xwiki:stable-postgres-tomcat
    depends_on: [db]
    ports: ["127.0.0.1:8080:8080"]
    environment:
      DB_HOST: db
      DB_DATABASE: xwiki
      DB_USER: xwiki
      DB_PASSWORD: MdpXwiki2026
    volumes: ["xwiki-data:/usr/local/xwiki"]
  db:
    image: postgres:17
    environment: { POSTGRES_DB: xwiki, POSTGRES_USER: xwiki, POSTGRES_PASSWORD: MdpXwiki2026, POSTGRES_INITDB_ARGS: "--encoding=UTF8" }
    volumes: ["pg-data:/var/lib/postgresql/data"]
volumes: { xwiki-data: {}, pg-data: {} }
```

```bash
docker compose up -d && docker compose logs -f web
```

Le volume `/usr/local/xwiki` contient le **répertoire permanent** (extensions installées, index de recherche Solr, pièces jointes, `xwiki.cfg` et `xwiki.properties`). Fonctionne sous Windows et macOS avec Docker Desktop.

## Paquets Debian / Ubuntu

XWiki publie un dépôt APT (`maven.xwiki.org`, canaux *stable* et *lts*) avec des paquets prêts à l'emploi combinant Tomcat et une base (par exemple `xwiki-tomcat10-pgsql` ou `xwiki-tomcat10-mysql`, nom exact selon la version : `apt search xwiki-tomcat`). L'installation configure Tomcat, la base et le répertoire permanent (`/var/lib/xwiki`).

## WAR sur Tomcat (Linux, Windows, macOS)

Déployer `xwiki-platform-distribution-war-<version>.war` dans Tomcat sous le nom `xwiki`, ajouter le pilote JDBC (`WEB-INF/lib`), configurer la connexion dans `WEB-INF/hibernate.cfg.xml` et le répertoire permanent (`environment.permanentDirectory` dans `WEB-INF/xwiki.properties`). Sous Windows, Tomcat s'installe comme service (installateur Apache Tomcat) ; prévoir `-Xmx2g` ou plus dans les options Java.

## Premier démarrage

Ouvrir `https://wiki.corp.exemple.fr` (reverse proxy vers le port 8080, chemin `/xwiki`) : l'**assistant de distribution** crée l'administrateur puis installe le *flavor* **XWiki Standard** (interface, applications de base). Ensuite, *Administrer le wiki* :

| Menu | Usage |
| --- | --- |
| Utilisateurs et groupes, Droits | Comptes, groupes, droits globaux et par espace |
| Authentification | LDAP/Active Directory (extension *LDAP Authenticator*), OIDC, SAML |
| Extensions | Gestionnaire d'extensions (installation, mises à jour) |
| Contenu → Import/Export | Archives XAR (sauvegarde partielle, migration de contenu) |
| Apparence | Thème, mise en page, langue (français) |

<!-- CAPTURE: Assistant de distribution XWiki (installation du flavor Standard) | _assets/xwiki-distribution.png -->
<!-- CAPTURE: Administration XWiki, droits d'un espace | _assets/xwiki-droits.png -->

## Exploitation

- Configuration : `xwiki.cfg` (authentification, cache, superadmin) et `xwiki.properties` (répertoire permanent, Solr, extensions). Le compte `superadmin` n'est actif que si `xwiki.superadminpassword` est défini dans `xwiki.cfg` : le réserver au dépannage.
- Sauvegarde : base de données **et** répertoire permanent (au minimum `store/` pour les pièces jointes et `extension/`), à la même date.
- Mise à jour : sauvegarder, changer l'image ou le paquet, redémarrer, puis suivre l'**assistant de distribution** qui met à jour les extensions et migre la base.

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Lenteurs, `OutOfMemoryError` | Mémoire JVM insuffisante | Augmenter `-Xmx` (variable `JAVA_OPTS`), cache |
| Recherche vide | Index Solr corrompu ou en reconstruction | Réindexer (*Administrer → Recherche*) |
| Liens générés en `http://` derrière le proxy | En-têtes du proxy | `X-Forwarded-Proto`, `X-Forwarded-Host` |
| Caractères accentués corrompus | Base non UTF-8 | Créer la base en UTF-8 / `utf8mb4` |

Commandes : [[90-aide-memoire|aide-mémoire]].

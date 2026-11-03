---
title: Liferay, Jahia et eXo Platform
description: Portails d'entreprise en Java — Liferay Portal CE (LGPL : portail, sites, gestion de contenu, documents, workflows, intégration LDAP et SSO ; Docker liferay/portal, bundle Tomcat, portal-ext.properties, base PostgreSQL ou MySQL, Elasticsearch/OpenSearch), Jahia (CMS et plateforme d'expérience numérique, composants communautaires, Docker) et eXo Platform Community (intranet collaboratif : espaces, réseau social, documents ; Docker exoplatform/exo-community), prérequis, installation, administration et sauvegarde.
tags: [liferay, jahia, exo platform, portail, intranet, java, tomcat, docker]
icon: layout-grid
---

Ces plateformes Java servent d'**intranet**, de **portail** client ou partenaire et de socle d'applications métier. Elles demandent davantage de ressources (4 à 8 Go de RAM pour la JVM, une base SQL, un moteur de recherche) qu'un CMS PHP. Pour un simple site ou wiki : [[01-wordpress/01-presentation-installation|WordPress]], [[02-xwiki|XWiki]].

## Liferay Portal CE

**Liferay Portal Community Edition** (LGPL) : sites et pages, gestion de contenu web, bibliothèque de documents, formulaires, flux de validation, droits et rôles fins, multilingue, connecteurs LDAP/SAML/OIDC, développement de modules (OSGi). La version commerciale s'appelle **Liferay DXP**.

```bash
docker run -d --name liferay -p 127.0.0.1:8080:8080 -v liferay-data:/opt/liferay/data liferay/portal:latest
docker logs -f liferay            # premier démarrage : plusieurs minutes
```

En production :
- base **PostgreSQL** ou MySQL déclarée dans `portal-ext.properties` (`jdbc.default.url`, `jdbc.default.username`, `jdbc.default.password`) ou par variables d'environnement `LIFERAY_JDBC_PERIOD_DEFAULT_PERIOD_URL`… dans l'image Docker ;
- moteur de recherche **Elasticsearch/OpenSearch** distant (l'instance intégrée ne sert qu'aux essais) ;
- volume persistant pour `/opt/liferay/data` (documents).

Le *bundle* Tomcat (archive) fonctionne aussi sous Linux, Windows et macOS : extraire, ajuster `portal-ext.properties`, lancer `tomcat/bin/startup.sh` (ou `startup.bat`). Premier accès : assistant de configuration (`http://srv-portail-01:8080`) puis *Control Panel* (utilisateurs, sites, instances, configuration système).

<!-- CAPTURE: Control Panel de Liferay | _assets/liferay-control-panel.png -->

## Jahia

**Jahia** (Suisse) est un CMS et une plateforme d'expérience numérique Java (édition de contenu, personnalisation, multisite). Les **composants communautaires** sont libres, la plateforme complète est commerciale. Installation : images Docker publiées par l'éditeur (plateforme et base de données) ou installateur Java, avec PostgreSQL/MariaDB et un reverse proxy ; administration par l'interface *jContent*. Vérifier les conditions de licence avant un déploiement en production.

## eXo Platform Community

**eXo Platform** (France, LGPL pour l'édition communautaire) est un **intranet collaboratif** : espaces d'équipe, fil d'activité social, documents (avec édition OnlyOffice), wiki, agenda, tâches, applications mobiles.

```bash
docker run -d --name exo -p 127.0.0.1:8080:8080 -v exo-data:/srv/exo exoplatform/exo-community:latest
```

En production : base MySQL ou PostgreSQL, Elasticsearch, MongoDB (chat) et un reverse proxy, selon la documentation de l'éditeur (fichiers Docker Compose fournis). Premier accès : assistant de création de l'administrateur, puis *Administration → Utilisateurs, Espaces, Annuaire LDAP*.

## Exploitation commune

- Sauvegarde : base SQL, dossier de données (documents), configuration (`portal-ext.properties`, variables), index de recherche reconstruisible.
- Mise à jour : suivre les procédures de migration de l'éditeur (outils d'*upgrade* Liferay, scripts eXo) sur une copie avant la production.
- Supervision de la JVM (mémoire, ramasse-miettes) et du moteur de recherche.

Commandes : [[90-aide-memoire|aide-mémoire]].

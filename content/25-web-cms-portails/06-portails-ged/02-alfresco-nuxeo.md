---
title: Alfresco et Nuxeo (GED)
description: Gestion électronique de documents (GED/ECM) — Alfresco Community (LGPL : dépôt de contenu, interface Share et Alfresco Content App, versions, métadonnées, workflows, recherche Elasticsearch ou Solr, WebDAV ; Docker Compose community-compose.yaml du dépôt acs-deployment : repository, share, transform-core, search, PostgreSQL, ActiveMQ) et Nuxeo (plateforme ECM, édition communautaire historique LTS 2021 plus maintenue, version commerciale Hyland), prérequis, administration, sauvegarde et migration.
tags: [alfresco, nuxeo, ged, ecm, documents, docker, java]
icon: archive
---

## Alfresco Community

**Alfresco Content Services Community** (LGPL, Hyland) est une GED complète : dépôt de documents avec **versions**, métadonnées et types de contenu, **workflows** (validation), règles de dossier, recherche plein texte (Elasticsearch ou Solr), partage par sites, accès par navigateur (**Share**, **Alfresco Content App**), **WebDAV** et API REST.

Installation de référence : **Docker Compose** du dépôt `Alfresco/acs-deployment` (fichier `docker-compose/community-compose.yaml`), qui lance le dépôt (`alfresco-content-repository-community`), Share, Alfresco Content App, la transformation de documents (`alfresco-transform-core-aio`), la recherche (**Elasticsearch** et indexation par lots ; Solr dans les déploiements plus anciens), PostgreSQL, ActiveMQ, la console *Control Center* et un proxy.

```bash
git clone --depth 1 https://github.com/Alfresco/acs-deployment.git && cd acs-deployment/docker-compose
docker compose -f community-compose.yaml up -d
docker compose -f community-compose.yaml logs -f alfresco
```

Prévoir **12 à 16 Go de RAM** pour l'ensemble. Accès (derrière le proxy fourni, port 8080 par défaut) : `/share` (interface Share), `/content-app`, `/alfresco` (dépôt, API). Compte initial **`admin` / `admin`** : à changer immédiatement. Adapter les origines CSRF (`CSRF_FILTER_ORIGIN`, `CSRF_FILTER_REFERER`) et les URL publiques à votre nom de domaine. L'éditeur fournit aussi des distributions ZIP (Tomcat) pour Linux et Windows et des charts Helm.

<!-- CAPTURE: Bibliothèque de documents d'un site dans Alfresco Share | _assets/alfresco-share-documents.png -->

Administration : *Admin Tools* de Share (utilisateurs, groupes, synchronisation **LDAP/Active Directory**, catégories, modèles), console d'administration *Control Center*, propriétés dans `alfresco-global.properties` (ou variables `JAVA_OPTS` du conteneur).

Sauvegarde : base PostgreSQL **et** dépôt de contenu (*content store*, dossier `alf_data`) à la même date ; l'index de recherche peut être reconstruit. Mise à jour : nouvelle version des images, en suivant les notes (migrations de schéma).

## Nuxeo

**Nuxeo** est une plateforme ECM en Java (gestion de documents et d'actifs numériques, modélisation par *Nuxeo Studio*). L'édition communautaire historique (LTS 2021, version 11) n'est **plus maintenue** ; les versions récentes sont commerciales (Hyland). Pour une installation existante : planifier la migration vers une version supportée ou vers Alfresco, ou une GED plus légère selon le besoin.

Commandes : [[90-aide-memoire|aide-mémoire]].

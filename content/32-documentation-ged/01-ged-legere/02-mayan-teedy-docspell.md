---
title: Mayan EDMS, Teedy et Docspell
description: Trois autres GED libres — Mayan EDMS (Python/Django : métadonnées typées, cabinets, workflows avec états et transitions, contrôle d'accès fin, signatures, versions, OCR, sources de documents, installation Docker Compose, port 80), Teedy (Java, GPL : léger, étiquettes, partage, OCR, chiffrement des fichiers au repos, versions, LDAP, Docker port 8080) et Docspell (Scala : traitement automatique et propositions de classement, analyse par NLP, scan vers dossier dsc, courriel, Docker Compose avec Solr ou PostgreSQL, port 7880) ; comparatif avec Paperless-ngx.
tags: [mayan edms, teedy, docspell, ged, ocr, workflow, archivage]
icon: scan-text
---

## Mayan EDMS

**Mayan EDMS** (Apache 2.0) est une GED plus **structurée** que Paperless-ngx, adaptée aux organisations : types de documents avec **métadonnées obligatoires**, **workflows** et contrôle d'accès détaillé.

| Fonction | Détail |
| --- | --- |
| Types de documents | Métadonnées typées et validées, durée de conservation, numérotation |
| **Cabinets** | Arborescence de classement (un document peut figurer dans plusieurs) |
| Index | Arborescences générées automatiquement à partir des métadonnées |
| **Workflows** | États et transitions (brouillon → validation → publié), actions automatiques |
| ACL | Droits par rôle, par objet (document, type, cabinet, étiquette) |
| Versions et signatures | Historique, signatures GPG intégrées ou détachées |
| Sources | Téléversement, dossier surveillé, IMAP/POP3, scanner SANE |

```bash
mkdir -p /srv/mayan && cd /srv/mayan
curl -o docker-compose.yml https://gitlab.com/mayan-edms/mayan-edms/-/raw/master/docker/docker-compose.yml
curl -o .env https://gitlab.com/mayan-edms/mayan-edms/-/raw/master/docker/.env
# Éditer .env : mots de passe de PostgreSQL et Redis/RabbitMQ, MAYAN_FRONTEND_HTTP_PORT, profils
docker compose up -d
docker compose logs -f app        # le mot de passe initial de l'administrateur s'affiche au premier démarrage
```

Les tâches lourdes (OCR, analyse) passent par des files ; prévoir plusieurs travailleurs pour un volume important.

## Teedy

**Teedy** (ex-Sismics Docs, GPL) est une GED **légère** en Java avec une interface simple : étiquettes hiérarchiques, recherche texte intégral, OCR, partage par lien, journal d'audit et **chiffrement des fichiers au repos**.

```bash
docker run -d --name teedy -p 127.0.0.1:8080:8080 \
  -v /srv/teedy:/data \
  -e DOCS_BASE_URL=https://docs.exemple.fr \
  -e DOCS_ADMIN_EMAIL_INIT=admin@exemple.fr \
  -e DOCS_ADMIN_PASSWORD_INIT='$2a$05$…' \
  sismics/docs:latest
# Base intégrée H2 par défaut ; PostgreSQL via DATABASE_URL, DATABASE_USER, DATABASE_PASSWORD
```

- Le mot de passe initial s'indique **haché en bcrypt** ; sans variable, le compte `admin`/`admin` est créé : le changer immédiatement.
- LDAP, flux de validation simples, versions de fichiers, import par courriel, API REST.
- Le développement est peu actif : vérifier l'état du projet avant de l'adopter.

## Docspell

**Docspell** (AGPL) mise sur l'**automatisation** : il analyse le texte (NLP) pour **proposer** correspondant, date, étiquettes et dossier ; l'utilisateur valide d'un clic.

```bash
git clone https://github.com/eikek/docspell && cd docspell/docker/docker-compose
docker compose up -d                       # restserver (7880), joex (traitement), PostgreSQL, Solr
# Interface : http://serveur:7880 ; créer un compte « collective » (espace partagé d'une organisation)
```

| Composant | Rôle |
| --- | --- |
| restserver | API et interface web |
| **joex** | Exécuteur des tâches : OCR, conversion, analyse, apprentissage |
| PostgreSQL | Données |
| Solr (ou PostgreSQL) | Recherche texte intégral |
| **dsc** | Outil en ligne de commande : surveiller un dossier et téléverser (scanner) |

```bash
dsc watch --delete -r /srv/scans --integration --header 'Docspell-Integration:collective1:<secret>'
```

Import par **courriel** (IMAP, règles par collectif), « notes » et champs personnalisés, liens entre documents, rappels de dates (échéances).

## Comparatif

| Critère | [[01-paperless-ngx\|Paperless-ngx]] | Mayan EDMS | Teedy | Docspell |
| --- | --- | --- | --- | --- |
| Public | Particuliers, PME | Organisations, processus | Petites équipes | Particuliers, PME |
| Classement automatique | Règles + apprentissage | Métadonnées, index | Manuel | Propositions NLP |
| Workflows | Simples (déclencheurs) | Complets | Simples | Non |
| Ressources | Modérées | Élevées | Faibles | Modérées (JVM) |
| Activité du projet | Très forte | Modérée | Faible | Modérée |

Commandes : [[90-aide-memoire|aide-mémoire]].

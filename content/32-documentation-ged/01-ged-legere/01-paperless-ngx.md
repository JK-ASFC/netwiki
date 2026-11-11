---
title: Paperless-ngx
description: Paperless-ngx, GED auto-hébergée (GPL) pour dématérialiser factures, contrats et courriers — OCR Tesseract avec langue française, classement automatique (correspondants, types, étiquettes, chemins de stockage) par règles et apprentissage, dossier de consommation, récupération par courriel, flux de travail, champs personnalisés, partage ; installation Docker Compose (PostgreSQL, Redis, Tika et Gotenberg), variables PAPERLESS_*, comptes et droits, sauvegarde par document_exporter, API REST et sécurité.
tags: [paperless-ngx, ged, ocr, dématérialisation, archivage, docker, tesseract]
icon: scan-text
---

**Paperless-ngx** transforme une pile de papiers en archive numérique **consultable** : chaque document scanné ou reçu est passé à l'**OCR**, converti en **PDF/A**, classé automatiquement et indexé en texte intégral. C'est la GED légère la plus populaire pour un particulier, une association ou une PME.

## Fonctionnement

| Notion | Rôle |
| --- | --- |
| **Consommation** | Un document déposé dans le dossier `consume`, envoyé par courriel ou téléversé est traité automatiquement |
| OCR | Tesseract (langues configurables, `fra` pour le français) ; le PDF obtient une couche texte |
| Correspondant | Émetteur (fournisseur, banque, administration) |
| Type de document | Facture, contrat, relevé… |
| Étiquettes | Classement libre (multi-étiquettes) |
| Chemin de stockage | Arborescence des fichiers sur disque (`{{ correspondent }}/{{ created_year }}/{{ title }}`) |
| **Correspondance automatique** | Règles (mot, expression régulière, approximative) ou **apprentissage** sur les documents déjà classés |
| Flux de travail | Actions déclenchées à l'ajout (assigner, notifier, appeler un webhook) |

## Installation (Docker Compose)

```yaml docker-compose.yml
services:
  broker:
    image: docker.io/library/redis:7
    restart: unless-stopped
    volumes: [ redisdata:/data ]
  db:
    image: docker.io/library/postgres:17
    restart: unless-stopped
    volumes: [ pgdata:/var/lib/postgresql/data ]
    environment: { POSTGRES_DB: paperless, POSTGRES_USER: paperless, POSTGRES_PASSWORD: "…" }
  webserver:
    image: ghcr.io/paperless-ngx/paperless-ngx:latest
    restart: unless-stopped
    depends_on: [ db, broker, gotenberg, tika ]
    ports: [ "127.0.0.1:8000:8000" ]
    volumes:
      - data:/usr/src/paperless/data
      - /srv/paperless/media:/usr/src/paperless/media
      - /srv/paperless/export:/usr/src/paperless/export
      - /srv/paperless/consume:/usr/src/paperless/consume
    environment:
      PAPERLESS_REDIS: redis://broker:6379
      PAPERLESS_DBHOST: db
      PAPERLESS_DBPASS: "…"
      PAPERLESS_URL: https://ged.exemple.fr
      PAPERLESS_SECRET_KEY: "<longue chaîne aléatoire>"
      PAPERLESS_TIME_ZONE: Europe/Paris
      PAPERLESS_OCR_LANGUAGE: fra+eng
      PAPERLESS_OCR_LANGUAGES: fra
      PAPERLESS_TIKA_ENABLED: 1
      PAPERLESS_TIKA_ENDPOINT: http://tika:9998
      PAPERLESS_TIKA_GOTENBERG_ENDPOINT: http://gotenberg:3000
      PAPERLESS_FILENAME_FORMAT: "{{ correspondent }}/{{ created_year }}/{{ title }}"
  gotenberg:
    image: docker.io/gotenberg/gotenberg:8
    restart: unless-stopped
    command: [ "gotenberg", "--chromium-disable-javascript=true", "--chromium-allow-list=file:///tmp/.*" ]
  tika:
    image: docker.io/apache/tika:latest
    restart: unless-stopped
volumes: { data: {}, pgdata: {}, redisdata: {} }
```

```bash
docker compose up -d
docker compose exec webserver createsuperuser
```

**Tika** et **Gotenberg** (voir [[03-signature-pdf/02-stirling-pdf-gotenberg|Gotenberg]]) permettent d'ingérer aussi des documents Office et des courriels (`.eml`) en les convertissant en PDF.

## Alimenter la GED

- **Scanner réseau** : configurer « scan vers dossier SMB/FTP » pointant sur le dossier `consume` (partage Samba ou FTP vers ce répertoire).
- **Courriel** : Paramètres → Courriels → comptes IMAP et règles (dossier, expéditeur, pièces jointes seulement), puis action après traitement (déplacer, marquer lu).
- **Application mobile** (tierces) ou glisser-déposer dans l'interface.
- Sous-dossiers du dossier de consommation transformés en étiquettes : `PAPERLESS_CONSUMER_RECURSIVE=true` et `PAPERLESS_CONSUMER_SUBDIRS_AS_TAGS=true`.

## Exploitation

```bash
docker compose exec webserver document_exporter ../export          # export complet (fichiers + métadonnées), à sauvegarder
docker compose exec webserver document_importer ../export          # restauration sur une instance vide
docker compose exec webserver document_retagger -c -T -t           # réappliquer correspondants, types et étiquettes
docker compose exec webserver document_index reindex
docker compose exec webserver document_sanity_checker               # vérifie empreintes et fichiers manquants
docker compose pull && docker compose up -d                         # mise à jour (migrations automatiques)
```

**API REST** (`/api/documents/`, jeton par utilisateur) : recherche, téléversement (`/api/documents/post_document/`), téléchargement.

## Sécurité

- Exposer derrière un proxy HTTPS, définir `PAPERLESS_URL` et `PAPERLESS_ALLOWED_HOSTS` ; activer l'authentification à deux facteurs ou l'OIDC (`PAPERLESS_APPS=allauth.socialaccount.providers.openid_connect`).
- **Droits** par propriétaire et partage par utilisateur ou groupe : par défaut, un document sans propriétaire est visible de tous.
- Les fichiers sont stockés **en clair** sur disque : chiffrer le volume et sauvegarder hors site (les originaux + l'export).
- Une GED n'est pas un **système d'archivage à valeur probante** : pour une conservation légale (factures électroniques, archivage probatoire), vérifier les exigences applicables (NF Z42-013, coffre-fort numérique).

Voir aussi : [[02-mayan-teedy-docspell|Mayan EDMS, Teedy et Docspell]] · [[02-ged-entreprise/01-openkm-logicaldoc-seeddms|GED d'entreprise]]. Commandes : [[90-aide-memoire|aide-mémoire]].

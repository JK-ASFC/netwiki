---
title: Outline et Wiki.js
description: Deux wikis d'équipe modernes auto-hébergés — Outline (BSL puis Apache : documents Markdown collaboratifs en temps réel, collections, recherche, API ; Docker Compose, PostgreSQL, Redis, stockage local ou S3, authentification OIDC obligatoire, variables URL, SECRET_KEY, UTILS_SECRET, DATABASE_URL, SMTP) et Wiki.js 2 (Node.js, AGPL : éditeurs Markdown, visuel et HTML, nombreux modules d'authentification et de stockage Git ; Docker ghcr.io/requarks/wiki:2, config.yml, PostgreSQL, Windows et macOS), reverse proxy, sauvegarde et mise à jour.
tags: [outline, wiki.js, wiki, base de connaissances, docker, oidc, markdown]
icon: book-open
---

| | **Outline** | **Wiki.js 2** |
| --- | --- | --- |
| Licence | BSL 1.1 (devient Apache 2.0 après délai) | AGPL v3 |
| Socle | Node.js, PostgreSQL, Redis | Node.js, PostgreSQL (aussi MySQL, MariaDB, SQL Server, SQLite) |
| Édition | Markdown collaboratif en temps réel, commentaires | Markdown, éditeur visuel, HTML, AsciiDoc |
| Organisation | Espaces, collections, documents imbriqués | Arborescence de pages, navigation personnalisable |
| Authentification | **Fournisseur externe obligatoire** (OIDC, Google, Microsoft, Slack) ou lien magique par courriel | Comptes locaux, LDAP, OIDC, SAML, Azure AD, etc. |
| Atouts | Rapidité, ergonomie, API, intégrations | Synchronisation **Git**, rendu de diagrammes, droits fins par chemin |

Autres solutions : [[09-bookstack|BookStack]], [[02-xwiki|XWiki]], [[03-mediawiki-dokuwiki|MediaWiki et DokuWiki]].

## Outline (Docker Compose)

```yaml
# /srv/outline/compose.yaml
services:
  outline:
    image: outlinewiki/outline:latest
    env_file: .env
    ports: ["127.0.0.1:3000:3000"]
    volumes: ["outline-data:/var/lib/outline/data"]
    depends_on: [postgres, redis]
  postgres:
    image: postgres:17
    environment: { POSTGRES_USER: outline, POSTGRES_PASSWORD: MdpOutline2026, POSTGRES_DB: outline }
    volumes: ["pg-data:/var/lib/postgresql/data"]
  redis:
    image: redis:7
volumes: { outline-data: {}, pg-data: {} }
```

```ini
# /srv/outline/.env
NODE_ENV=production
URL=https://wiki.corp.exemple.fr
PORT=3000
SECRET_KEY=resultat_de_openssl_rand_hex_32
UTILS_SECRET=autre_resultat_de_openssl_rand_hex_32
DEFAULT_LANGUAGE=fr_FR
DATABASE_URL=postgres://outline:MdpOutline2026@postgres:5432/outline
PGSSLMODE=disable
REDIS_URL=redis://redis:6379
FILE_STORAGE=local
FILE_STORAGE_LOCAL_ROOT_DIR=/var/lib/outline/data
FORCE_HTTPS=true
OIDC_CLIENT_ID=outline
OIDC_CLIENT_SECRET=secret_du_client_oidc
OIDC_AUTH_URI=https://sso.corp.exemple.fr/realms/corp/protocol/openid-connect/auth
OIDC_TOKEN_URI=https://sso.corp.exemple.fr/realms/corp/protocol/openid-connect/token
OIDC_USERINFO_URI=https://sso.corp.exemple.fr/realms/corp/protocol/openid-connect/userinfo
OIDC_USERNAME_CLAIM=preferred_username
OIDC_DISPLAY_NAME=Compte de l'entreprise
SMTP_SERVICE=
SMTP_USERNAME=outline@corp.exemple.fr
SMTP_PASSWORD=MdpSmtp2026
SMTP_FROM_EMAIL=outline@corp.exemple.fr
```

```bash
cd /srv/outline
for v in SECRET_KEY UTILS_SECRET; do sed -i "s/^$v=.*/$v=$(openssl rand -hex 32)/" .env; done
docker compose up -d && docker compose logs -f outline       # migrations au premier démarrage
```

Le client OIDC se déclare dans [[05-keycloak/01-presentation-installation|Keycloak]] (URI de redirection `https://wiki.corp.exemple.fr/auth/oidc.callback`). La première personne qui se connecte crée l'espace et en devient administrateur. Reverse proxy TLS avec WebSocket (édition collaborative). Sauvegarde : base PostgreSQL et volume `outline-data` (ou compartiment S3).

<!-- CAPTURE: Document Outline en édition collaborative | _assets/outline-document.png -->

## Wiki.js 2 (Docker)

```bash
docker network create wikijs
docker run -d --name wikijs-db --network wikijs -e POSTGRES_USER=wikijs -e POSTGRES_PASSWORD=MdpWikijs2026 -e POSTGRES_DB=wiki -v wikijs_pg:/var/lib/postgresql/data postgres:17
docker run -d --name wikijs --network wikijs -p 127.0.0.1:3000:3000 \
  -e DB_TYPE=postgres -e DB_HOST=wikijs-db -e DB_PORT=5432 -e DB_USER=wikijs -e DB_PASS=MdpWikijs2026 -e DB_NAME=wiki \
  ghcr.io/requarks/wiki:2
```

Sans Docker (Linux, Windows, macOS) : Node.js LTS, archive `wiki-js.tar.gz` des versions publiées, copie de `config.sample.yml` en `config.yml` (section `db:` : `type`, `host`, `port`, `user`, `pass`, `db`), puis `node server` (service systemd ou service Windows via NSSM).

Ouvrir `https://wiki.corp.exemple.fr` : l'assistant crée l'administrateur et l'adresse du site. Dans *Administration* :

| Menu | Usage |
| --- | --- |
| Authentification | LDAP/AD, OIDC, SAML, Azure AD ; inscription libre à désactiver |
| Groupes | Droits par groupe et règles par chemin (`/rh/*` lecture seule…) |
| Stockage | **Git** (synchronisation bidirectionnelle avec un dépôt), S3, disque local, sauvegarde |
| Recherche | Moteur intégré, PostgreSQL ou Elasticsearch |
| Rendu | Diagrammes (Mermaid, PlantUML), mathématiques |

<!-- CAPTURE: Administration Wiki.js, module de stockage Git | _assets/wikijs-stockage-git.png -->

Sauvegarde : base de données (et dépôt Git si le module est utilisé). Mise à jour : nouvelle image `ghcr.io/requarks/wiki:2` puis recréation du conteneur (ou *Administration → Système → Mettre à jour* selon l'installation). La version 3 de Wiki.js est un projet distinct en cours de développement : rester sur la branche 2 en production.

Commandes : [[90-aide-memoire|aide-mémoire]].

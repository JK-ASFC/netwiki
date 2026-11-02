---
title: HedgeDoc, Etherpad et CryptPad
description: Édition collaborative en temps réel auto-hébergée — HedgeDoc 1.x (AGPL : notes Markdown partagées, présentations, diagrammes ; Docker quay.io/hedgedoc/hedgedoc, PostgreSQL, variables CMD_*, LDAP, OAuth2), Etherpad (Apache 2.0 : pads de texte, historique, extensions ; installateur Linux/macOS/Windows, pnpm, Docker etherpad/etherpad, settings.json, ADMIN_PASSWORD, /admin), CryptPad (AGPL : suite chiffrée de bout en bout, documents, tableurs, kanban, formulaires ; deux domaines principal et bac à sable, NGINX, Node.js, Docker), reverse proxy WebSocket, sauvegarde et mise à jour.
tags: [hedgedoc, etherpad, cryptpad, édition collaborative, markdown, chiffrement, docker]
icon: file-pen-line
---

| | **HedgeDoc** | **Etherpad** | **CryptPad** |
| --- | --- | --- | --- |
| Licence | AGPL v3 | Apache 2.0 | AGPL v3 |
| Contenu | Notes **Markdown** (aperçu en direct, Mermaid, diapositives) | Texte enrichi simple (*pads*), couleurs par auteur | Suite : documents, tableurs et présentations (OnlyOffice), code, kanban, formulaires, tableau blanc |
| Chiffrement | Serveur (accès par lien ou compte) | Serveur | **De bout en bout** : le serveur ne voit pas le contenu |
| Socle | Node.js + PostgreSQL/MySQL | Node.js + base (SQLite, PostgreSQL, MySQL…) | Node.js + NGINX, fichiers |

Utilisations : comptes rendus de réunion, prise de notes en incident, documentation rapide, rédaction à plusieurs. Pour un wiki durable : [[17-wikis/01-outline-wikijs|Outline, Wiki.js]].

## HedgeDoc 1.x (Docker)

```yaml
# compose.yaml
services:
  database:
    image: postgres:17-alpine
    environment: [POSTGRES_USER=hedgedoc, POSTGRES_PASSWORD=MdpHedgedoc2026, POSTGRES_DB=hedgedoc]
    volumes: [database:/var/lib/postgresql/data]
    restart: always
  app:
    image: quay.io/hedgedoc/hedgedoc:1.12.0
    environment:
      - CMD_DB_URL=postgres://hedgedoc:MdpHedgedoc2026@database:5432/hedgedoc
      - CMD_DOMAIN=notes.corp.exemple.fr
      - CMD_PROTOCOL_USESSL=true
      - CMD_URL_ADDPORT=false
      - CMD_ALLOW_ANONYMOUS=false
      - CMD_ALLOW_EMAIL_REGISTER=false
      - CMD_SESSION_SECRET=chaine_aleatoire_longue
    volumes: [uploads:/hedgedoc/public/uploads]
    ports: ["127.0.0.1:3000:3000"]
    depends_on: [database]
    restart: always
volumes: { database: {}, uploads: {} }
```

Authentification d'entreprise par variables : LDAP (`CMD_LDAP_URL`, `CMD_LDAP_BINDDN`, `CMD_LDAP_SEARCHBASE`, `CMD_LDAP_SEARCHFILTER`), OAuth2/OIDC générique (`CMD_OAUTH2_*`, par exemple avec [[05-keycloak/01-presentation-installation|Keycloak]]), SAML. Comptes locaux en CLI : `docker compose exec app bin/manage_users --add jk@corp.exemple.fr`. La version 2 de HedgeDoc est une réécriture distincte : rester sur la 1.x en production tant que la 2 n'est pas stable.

<!-- CAPTURE: Note HedgeDoc en mode édition et aperçu côte à côte | _assets/hedgedoc-note.png -->

## Etherpad

```bash
# Linux, macOS, WSL : installateur officiel (clone, dépendances, compilation)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ether/etherpad/master/bin/installer.sh)"
cd etherpad-lite && pnpm run prod            # http://localhost:9001
```

```powershell
# Windows
irm https://raw.githubusercontent.com/ether/etherpad/master/bin/installer.ps1 | iex
```

Docker Compose (image officielle `etherpad/etherpad`, aussi `ghcr.io/ether/etherpad`) :

```yaml
services:
  app:
    image: etherpad/etherpad:latest
    environment:
      NODE_ENV: production
      ADMIN_PASSWORD: MdpAdminEtherpad2026
      DB_TYPE: postgres
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: etherpad
      DB_USER: etherpad
      DB_PASS: MdpEtherpad2026
      TRUST_PROXY: "true"
    volumes: [plugins:/opt/etherpad-lite/src/plugin_packages, etherpad-var:/opt/etherpad-lite/var]
    ports: ["127.0.0.1:9001:9001"]
    depends_on: [postgres]
  postgres:
    image: postgres:17-alpine
    environment: { POSTGRES_DB: etherpad, POSTGRES_USER: etherpad, POSTGRES_PASSWORD: MdpEtherpad2026 }
    volumes: [pg-data:/var/lib/postgresql/data]
volumes: { plugins: {}, etherpad-var: {}, pg-data: {} }
```

Hors Docker, la configuration est dans `settings.json` (base, `trustProxy`, utilisateurs, `requireAuthentication`). L'interface d'administration (`https://pad.corp.exemple.fr/admin`, compte `admin`) installe les **extensions** (`ep_headings2`, `ep_comments_page`, authentification LDAP/OIDC…) et affiche la configuration.

<!-- CAPTURE: Pad Etherpad avec couleurs des auteurs | _assets/etherpad-pad.png -->

## CryptPad

CryptPad exige **deux noms de domaine** : le domaine principal (`cryptpad.corp.exemple.fr`) et un domaine **bac à sable** (`cryptpad-sandbox.corp.exemple.fr`) qui isole le code des documents. L'éditeur recommande NGINX + Node.js (installation depuis les sources) ; une image Docker `cryptpad/cryptpad` et un `docker-compose.yml` sont fournis mais hors support officiel.

```bash
git clone https://github.com/cryptpad/cryptpad.git /opt/cryptpad && cd /opt/cryptpad
git checkout $(git tag --sort=-v:refname | head -1)      # dernière version publiée
npm ci && npm run install:components
cp config/config.example.js config/config.js            # domaines principal et bac à sable, limites, rétention
node server                                             # en production : service systemd et NGINX (modèle fourni dans docs/)
```

En Docker : variables `CPAD_MAIN_DOMAIN=https://cryptpad.corp.exemple.fr` et `CPAD_SANDBOX_DOMAIN=https://cryptpad-sandbox.corp.exemple.fr`, port 3000 et volumes `blob`, `block`, `data`, `datastore`, `config`. NGINX doit servir les deux domaines avec les en-têtes de sécurité du modèle fourni (CSP stricte) et transmettre le WebSocket.

Au premier démarrage, le serveur affiche dans ses journaux un **lien d'installation** pour créer le compte administrateur (panneau `/admin` : quotas, inscriptions, annonces, état). Les comptes sont protégés par mot de passe et, en option, TOTP (`enforceMFA`).

<!-- CAPTURE: Lecteur CryptPad avec documents et tableurs | _assets/cryptpad-lecteur.png -->

> [!WARNING]
> Le chiffrement étant de bout en bout, un **mot de passe perdu** rend les documents de l'utilisateur illisibles : l'administrateur ne peut pas les récupérer.

## Exploitation commune

- Reverse proxy TLS avec WebSocket ([[03-nginx/05-reverse-proxy-repartition|NGINX]]), ports applicatifs sur `127.0.0.1`.
- Sauvegarde : base PostgreSQL (HedgeDoc, Etherpad) et volumes de fichiers ; pour CryptPad, dossiers `blob/`, `block/`, `data/`, `datastore/` et `config/`.
- Mise à jour : nouvelle image ou nouvelle étiquette Git, puis redémarrage (CryptPad : `npm ci && npm run install:components` après chaque mise à jour).

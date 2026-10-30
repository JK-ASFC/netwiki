---
title: Présentation et installation
description: Vaultwarden, serveur compatible Bitwarden écrit en Rust — gestionnaire de mots de passe d'équipe auto-hébergé (chiffrement de bout en bout, organisations, collections, partages), comparaison avec Bitwarden auto-hébergé, installation Docker, variables essentielles (domaine, inscriptions, jeton d'administration, SMTP, base), reverse proxy HTTPS et clients.
tags: [vaultwarden, bitwarden, mots de passe, docker, coffre, équipe, installation]
icon: info
---

**Vaultwarden** (AGPL) réimplémente l'API du serveur **Bitwarden** : on utilise les **clients officiels** Bitwarden (extensions de navigateur, applications Windows/macOS/Linux, mobiles, CLI) avec un serveur léger auto-hébergé (quelques dizaines de Mo de RAM). Les coffres sont **chiffrés de bout en bout** : le serveur ne voit jamais les mots de passe en clair.

Pour une équipe réseau/système, c'est un moyen simple de remplacer les fichiers de mots de passe partagés : comptes d'équipements, accès d'urgence, licences, identifiants de prestataires, avec partage par **organisations** et **collections**.

## Vaultwarden ou Bitwarden auto-hébergé ?

| Critère | Vaultwarden | Bitwarden (auto-hébergé officiel) |
| --- | --- | --- |
| Éditeur | Communauté (non officiel) | Bitwarden Inc. |
| Ressources | Très faibles (un conteneur) | Plus lourdes (plusieurs conteneurs, SQL Server ou édition « lite ») |
| Fonctions entreprise | Organisations, collections, groupes, politiques, *Send*, accès d'urgence | + SSO, synchronisation d'annuaire, support, audits de conformité, licences |
| Support | Communauté | Commercial |

Pour une organisation qui exige un support éditeur ou des certifications, préférez Bitwarden ; Vaultwarden convient très bien aux équipes et PME.

## Installation (Docker)

```yaml /srv/vaultwarden/compose.yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest       # figer une version précise en production
    container_name: vaultwarden
    restart: unless-stopped
    environment:
      DOMAIN: "https://coffre.exemple.fr"
      SIGNUPS_ALLOWED: "false"
      INVITATIONS_ALLOWED: "true"
      SHOW_PASSWORD_HINT: "false"
      ADMIN_TOKEN: "$$argon2id$$v=19$$m=65540,t=3,p=4$$…"     # hachage Argon2 (les $ sont doublés dans Compose)
      SMTP_HOST: "relais.corp.exemple.fr"
      SMTP_PORT: "587"
      SMTP_SECURITY: "starttls"
      SMTP_FROM: "coffre@exemple.fr"
      LOG_FILE: "/data/vaultwarden.log"
      IP_HEADER: "X-Real-IP"
    volumes:
      - ./data:/data
    ports:
      - "127.0.0.1:8080:80"
```

```bash
docker run --rm -it vaultwarden/server /vaultwarden hash      # génère le hachage du jeton d'administration
docker compose up -d
```

| Variable | Rôle |
| --- | --- |
| `DOMAIN` | URL publique exacte (liens des courriels, WebAuthn) |
| `SIGNUPS_ALLOWED=false` | Pas d'inscription libre ; utilisateurs **invités** |
| `SIGNUPS_DOMAINS_WHITELIST` | Ou : inscription limitée à un domaine de messagerie |
| `ADMIN_TOKEN` | Accès à la page `/admin` (hachage Argon2) ; vide = page désactivée |
| `DATABASE_URL` | SQLite par défaut (`/data/db.sqlite3`) ; PostgreSQL ou MySQL possibles |
| `SMTP_*` | Invitations, vérification d'adresse, alertes de connexion |

## Reverse proxy HTTPS

Les clients exigent **HTTPS** (l'API de chiffrement des navigateurs ne fonctionne qu'en contexte sécurisé).

```nginx /etc/nginx/sites-available/coffre.conf (extrait)
server {
    listen 443 ssl;
    http2 on;
    server_name coffre.exemple.fr;
    client_max_body_size 525M;                     # pièces jointes
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;     # notifications en temps réel (WebSocket)
        proxy_set_header Connection "upgrade";
    }
}
```

## Clients

Dans chaque client Bitwarden : **Paramètres → Auto-hébergé** (ou choix du serveur à l'écran de connexion), URL `https://coffre.exemple.fr`.

| Client | Remarque |
| --- | --- |
| Extensions Chrome, Edge, Firefox, Safari | Remplissage automatique |
| Applications Windows, macOS, Linux | Coffre complet |
| Android, iOS | Remplissage automatique du système |
| CLI `bw` | Scripts (`bw config server https://coffre.exemple.fr`) |

## Suite

[[02-organisations-securite-exploitation|Organisations, sécurité, sauvegarde et exploitation]]

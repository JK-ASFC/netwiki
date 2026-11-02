---
title: Chatwoot
description: Chatwoot (MIT) — plateforme libre de support client omnicanal (chat sur site web, courriel, WhatsApp, Telegram, Facebook, Instagram, API) : architecture (Ruby on Rails, Sidekiq, PostgreSQL avec pgvector, Redis), installation Ubuntu par script officiel et CLI cwctl, Docker Compose officiel, variables .env (FRONTEND_URL, SECRET_KEY_BASE, SMTP, stockage), reverse proxy NGINX, boîtes de réception, équipes, réponses enregistrées, automatisations, SLA, centre d'aide, sauvegarde, mise à jour et dépannage.
tags: [chatwoot, support client, omnicanal, live chat, helpdesk, rails, docker]
icon: messages-square
---

**Chatwoot** (MIT pour l'édition communautaire) est une alternative libre à Intercom ou Zendesk : les conversations des clients arrivent de plusieurs **canaux** (widget de chat du site web, courriel, WhatsApp, Telegram, Facebook, Instagram, SMS, API) dans une interface unique où les **agents** répondent, se répartissent le travail et suivent des indicateurs. Pour les tickets internes et la gestion de parc, voir plutôt [[06-zammad|Zammad]], [[04-glpi-installation|GLPI]] ou [[13-freescout|FreeScout]].

| Composant | Rôle |
| --- | --- |
| Rails (Puma) | Application web et API, port 3000 |
| Sidekiq | Tâches de fond (courriels, webhooks, automatisations) |
| PostgreSQL (avec l'extension pgvector) | Base de données |
| Redis | Files Sidekiq, temps réel (ActionCable) |
| Stockage | Disque local ou S3 pour les pièces jointes |

Prérequis : 4 Go de RAM, 2 vCPU, un nom DNS (`support.corp.exemple.fr`) et un relais SMTP. Fonctionne sous **Linux** (Ubuntu conseillé) ; sous Windows ou macOS, utiliser Docker Desktop.

## Installation sur Ubuntu (script officiel)

```bash
wget https://get.chatwoot.app/linux/install.sh
chmod +x install.sh
sudo ./install.sh --install       # Ruby, Node, PostgreSQL, Redis, NGINX et certificat (questions interactives)
```

Le script crée l'utilisateur `chatwoot`, l'application dans `/home/chatwoot/chatwoot`, les services systemd (`chatwoot.target` : web et worker) et installe la CLI **cwctl** :

```bash
cwctl --help
cwctl -r              # redémarrer Chatwoot
cwctl -l web          # journaux du service web (ou -l worker)
cwctl -c              # console Rails
cwctl --upgrade       # mise à jour vers la dernière version
```

## Docker Compose (officiel)

```bash
mkdir -p /srv/chatwoot && cd /srv/chatwoot
wget -O .env https://raw.githubusercontent.com/chatwoot/chatwoot/develop/.env.example
wget -O docker-compose.yaml https://raw.githubusercontent.com/chatwoot/chatwoot/develop/docker-compose.production.yaml
nano .env                       # voir ci-dessous ; reporter le mot de passe PostgreSQL dans docker-compose.yaml
docker compose run --rm rails bundle exec rails db:chatwoot_prepare
docker compose up -d
curl -I http://127.0.0.1:3000/api          # 200 attendu
```

Variables essentielles du fichier `.env` :

```ini
SECRET_KEY_BASE=valeur_aleatoire_longue          # openssl rand -hex 64
FRONTEND_URL=https://support.corp.exemple.fr
DEFAULT_LOCALE=fr
ENABLE_ACCOUNT_SIGNUP=false
RAILS_ENV=production
POSTGRES_HOST=postgres
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=MdpChatwoot2026
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=MdpRedis2026
MAILER_SENDER_EMAIL=Support <support@corp.exemple.fr>
SMTP_ADDRESS=smtp.corp.exemple.fr
SMTP_PORT=587
SMTP_USERNAME=support@corp.exemple.fr
SMTP_PASSWORD=MdpSmtp2026
SMTP_AUTHENTICATION=login
SMTP_ENABLE_STARTTLS_AUTO=true
ACTIVE_STORAGE_SERVICE=local
```

Le port 3000 reste lié à `127.0.0.1` : publier Chatwoot par un reverse proxy. À chaque mise à jour des images, relancer `docker compose run --rm rails bundle exec rails db:chatwoot_prepare` (migrations).

## Reverse proxy NGINX

```nginx
server {
  listen 443 ssl http2;
  server_name support.corp.exemple.fr;
  ssl_certificate     /etc/letsencrypt/live/support.corp.exemple.fr/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/support.corp.exemple.fr/privkey.pem;
  client_max_body_size 40M;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;          # ActionCable (temps réel)
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
  }
}
```

## Interface graphique

Ouvrir `https://support.corp.exemple.fr` : l'assistant crée le **compte super-administrateur** et le premier compte (entreprise).

| Menu | Usage |
| --- | --- |
| Conversations | Boîte commune, filtres (ouvertes, en attente, résolues), affectation, notes privées, priorités |
| Paramètres → Boîtes de réception | Ajouter un canal : site web (copier le script du **widget**), courriel (IMAP/SMTP ou transfert), WhatsApp Cloud, Telegram, API |
| Paramètres → Agents, Équipes | Comptes des agents (rôles administrateur ou agent), équipes et répartition automatique |
| Paramètres → Réponses enregistrées, Libellés, Macros | Modèles de réponse (`/` dans l'éditeur), étiquetage, actions groupées |
| Paramètres → Automatisations, SLA | Règles (affecter, étiqueter, envoyer un message), délais de réponse |
| Centre d'aide | Base de connaissances publique, multilingue |
| Rapports | Volume, délais de première réponse et de résolution, satisfaction (CSAT) |
| `/super_admin` | Super-administration de l'instance (comptes, configuration, statut) |

<!-- CAPTURE: Boîte de conversations Chatwoot avec une conversation ouverte | _assets/chatwoot-conversations.png -->
<!-- CAPTURE: Ajout d'une boîte de réception Site web (widget) | _assets/chatwoot-widget.png -->

## Sécurité, sauvegarde, mise à jour

- `ENABLE_ACCOUNT_SIGNUP=false`, **2FA** des agents (profil), accès à `/super_admin` limité, PostgreSQL et Redis non exposés.
- Sauvegarde : base PostgreSQL (`pg_dump`) et pièces jointes (`storage/` ou compartiment S3) ; conserver `.env` (le `SECRET_KEY_BASE` chiffre des données).

```bash
docker compose exec -T postgres pg_dump -U postgres -Fc chatwoot_production > /srv/sauvegardes/chatwoot-$(date +%F).dump
docker compose pull && docker compose run --rm rails bundle exec rails db:chatwoot_prepare && docker compose up -d
```

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Messages n'apparaissant qu'après rechargement | WebSocket ActionCable bloqué | En-têtes `Upgrade`/`Connection` sur le proxy |
| Courriels non envoyés | SMTP ou worker Sidekiq arrêté | `cwctl -l worker`, variables `SMTP_*` |
| Liens vers `0.0.0.0:3000` | `FRONTEND_URL` non renseignée | Corriger `.env`, redémarrer |
| Erreur après mise à jour | Migrations non appliquées | `rails db:chatwoot_prepare` |

Commandes : [[90-aide-memoire|aide-mémoire]].

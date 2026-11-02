---
title: Présentation et installation
description: Mattermost Team Edition — messagerie d'équipe auto-hébergée (canaux, messages privés, fils, fichiers, appels, playbooks, intégrations, webhooks), architecture (serveur Go, PostgreSQL, stockage de fichiers local ou S3, reverse proxy), ports, éditions et licences, installation sur Ubuntu/Debian (dépôt officiel deb.packages.mattermost.com), RHEL/Rocky/Alma (archive tar.gz et unité systemd), Docker Compose officiel, Kubernetes (Helm), clients Windows, macOS, Linux et mobiles, premier démarrage et compte administrateur.
tags: [mattermost, chat, messagerie d'équipe, slack, postgresql, docker, linux]
icon: download
---

**Mattermost** est une messagerie d'équipe auto-hébergée, alternative à Slack ou Microsoft Teams : équipes, **canaux** publics et privés, messages directs, **fils de discussion**, partage de fichiers, recherche, appels audio et partage d'écran (*Calls*), *playbooks* d'incident et nombreuses intégrations (webhooks, commandes *slash*, robots, GitLab, Jira). Il est apprécié des équipes techniques et des organisations qui doivent garder leurs échanges sur leur propre infrastructure.

| Édition | Licence | Contenu |
| --- | --- | --- |
| **Team Edition** | Libre (MIT pour les binaires, AGPL/Apache pour le code) | Fonctions de base, sans support |
| Entreprise (Professional, Enterprise) | Commerciale | SSO SAML, LDAP/AD, haute disponibilité, conformité, support |

La même image « Enterprise » fonctionne sans licence avec les fonctions gratuites ; l'image `mattermost-team-edition` ne contient que le code libre. Alternatives : [[13-rocketchat/01-presentation-installation|Rocket.Chat]], [[14-zulip/01-presentation-installation|Zulip]], [[11-matrix/01-synapse-ess|Matrix]].

## Architecture et ports

```mermaid
flowchart LR
  C[Navigateur, bureau, mobile] -->|HTTPS 443| P[Reverse proxy NGINX]
  P -->|HTTP 8065 + WebSocket| M[Serveur Mattermost]
  M --> DB[(PostgreSQL)]
  M --> F[(Fichiers : disque local ou S3)]
  C -.->|UDP 8443 appels| M
```

| Port | Rôle |
| --- | --- |
| 8065/tcp | Application (HTTP et WebSocket), derrière le reverse proxy |
| 443/tcp | Accès des utilisateurs (reverse proxy) |
| 8443/udp et tcp | Appels audio/vidéo (*Calls*, RTC) |
| 8067/tcp | Métriques Prometheus (éditions payantes) |

Prérequis : 2 vCPU et 4 Go de RAM pour quelques centaines d'utilisateurs, **PostgreSQL** (base recommandée et prise en charge par défaut ; voir [[02-postgresql/02-installation|PostgreSQL]]), un nom DNS (`chat.corp.exemple.fr`) et un certificat.

## Base de données

```bash
sudo apt install -y postgresql
sudo -u postgres psql -c "CREATE USER mmuser WITH PASSWORD 'MdpMattermost2026';"
sudo -u postgres psql -c "CREATE DATABASE mattermost OWNER mmuser ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8' TEMPLATE template0;"
```

## Ubuntu / Debian (dépôt officiel)

```bash
curl -o- https://deb.packages.mattermost.com/repo-setup.sh | sudo bash -s mattermost
sudo apt update && sudo apt install -y mattermost
sudo install -C -m 600 -o mattermost -g mattermost /opt/mattermost/config/config.defaults.json /opt/mattermost/config/config.json
```

Dans `/opt/mattermost/config/config.json`, renseigner au minimum :

```json
"ServiceSettings": { "SiteURL": "https://chat.corp.exemple.fr" },
"SqlSettings": {
  "DriverName": "postgres",
  "DataSource": "postgres://mmuser:MdpMattermost2026@localhost:5432/mattermost?sslmode=disable&connect_timeout=10"
}
```

```bash
sudo systemctl enable --now mattermost
curl -s http://localhost:8065/api/v4/system/ping        # {"status":"OK",…}
```

Le paquet installe dans `/opt/mattermost`, crée l'utilisateur `mattermost` et l'unité systemd. Mise à jour : `sudo systemctl stop mattermost && sudo apt update && sudo apt upgrade`.

## RHEL / Rocky / Alma (archive)

```bash
V=11.10.1                                   # version à installer : voir mattermost.com/download
wget https://releases.mattermost.com/$V/mattermost-$V-linux-amd64.tar.gz
tar -xzf mattermost-$V-linux-amd64.tar.gz && sudo mv mattermost /opt
sudo mkdir -p /opt/mattermost/data
sudo useradd --system --user-group mattermost
sudo chown -R mattermost:mattermost /opt/mattermost && sudo chmod -R g+w /opt/mattermost
sudo tee /etc/systemd/system/mattermost.service >/dev/null <<'UNIT'
[Unit]
Description=Mattermost
After=network.target postgresql.service
[Service]
Type=notify
ExecStart=/opt/mattermost/bin/mattermost
TimeoutStartSec=3600
Restart=always
RestartSec=10
WorkingDirectory=/opt/mattermost
User=mattermost
Group=mattermost
LimitNOFILE=49152
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload && sudo systemctl enable --now mattermost
sudo firewall-cmd --permanent --add-service=https && sudo firewall-cmd --permanent --add-port=8443/udp && sudo firewall-cmd --reload
```

Avec SELinux actif, autoriser NGINX à joindre l'application : `sudo setsebool -P httpd_can_network_connect 1`.

## Docker Compose (méthode officielle)

```bash
git clone https://github.com/mattermost/docker mattermost-docker && cd mattermost-docker
cp env.example .env        # DOMAIN=chat.corp.exemple.fr, POSTGRES_PASSWORD, MATTERMOST_IMAGE=mattermost-team-edition
mkdir -p ./volumes/app/mattermost/{config,data,logs,plugins,client/plugins,bleve-indexes}
sudo chown -R 2000:2000 ./volumes/app/mattermost
docker compose -f docker-compose.yml -f docker-compose.without-nginx.yml up -d      # derrière un proxy existant
# ou avec le NGINX fourni (certificats dans ./volumes/web/cert) :
docker compose -f docker-compose.yml -f docker-compose.nginx.yml up -d
```

## Kubernetes

Chart Helm officiel (`helm repo add mattermost https://helm.mattermost.com`, chart `mattermost/mattermost-team-edition`) ou **Mattermost Operator** pour les installations multi-instances. Prévoir une base PostgreSQL gérée et un stockage S3 (MinIO) pour les fichiers.

## Windows et macOS

Pas de serveur Mattermost natif sous Windows ni macOS : utiliser Docker Desktop, WSL 2 ou une VM Linux. Les **clients** existent partout :

```powershell
winget install --id Mattermost.MattermostDesktop -e
```

```bash
brew install --cask mattermost             # macOS
sudo snap install mattermost-desktop --classic   # Linux (également .deb, .rpm, Flatpak)
```

Clients mobiles : App Store et Google Play (« Mattermost »), en saisissant l'adresse `https://chat.corp.exemple.fr`.

## Premiers pas

1. Placer le [[03-nginx/05-reverse-proxy-repartition|reverse proxy NGINX]] devant le port 8065 (WebSocket indispensable, voir [[02-configuration-exploitation|configuration]]).
2. Ouvrir `https://chat.corp.exemple.fr` : le **premier compte créé devient administrateur système**, puis l'assistant crée la première équipe.
3. Désactiver l'inscription libre et inviter les utilisateurs (ou brancher LDAP/SSO), voir [[03-interface-graphique|interface graphique]].

<!-- CAPTURE: Assistant de premier démarrage (création du compte administrateur et de l'équipe) | _assets/mattermost-premier-demarrage.png -->

Suite : [[02-configuration-exploitation|configuration et exploitation]] · [[90-aide-memoire|aide-mémoire]].

---
title: Présentation et installation
description: Gitea, forge Git légère écrite en Go — fonctions (dépôts, demandes de fusion, tickets, wiki, registres de paquets, Gitea Actions), comparaison avec GitLab et Forgejo, installation du binaire avec systemd sous Linux, Docker, Windows (service) et macOS, base de données, assistant d'installation et reverse proxy.
tags: [gitea, forge, git, installation, go, docker, windows, reverse proxy]
icon: info
---

**Gitea** est une forge Git **légère** (un seul binaire, quelques centaines de Mo de RAM) offrant l'essentiel : dépôts, demandes de fusion avec revue, tickets, wiki, organisations et équipes, **registre de paquets** (conteneurs, npm, PyPI, Maven…), miroirs et **Gitea Actions** (CI compatible avec la syntaxe GitHub Actions). Licence MIT.

## Gitea, Forgejo ou GitLab ?

| Critère | Gitea | [[04-forgejo/01-presentation-installation\|Forgejo]] | [[02-gitlab/01-presentation-installation\|GitLab]] |
| --- | --- | --- | --- |
| Ressources | Très faibles | Très faibles | Importantes (8 Go+) |
| Gouvernance | Gitea Ltd + communauté | Communauté (Codeberg), GPL | GitLab Inc. |
| CI/CD | Gitea Actions | Forgejo Actions | GitLab CI (très complet) |
| Fonctions entreprise | Essentielles | Essentielles | Très étendues |
| Usage typique | PME, équipes techniques, laboratoires | Idem, préférence pour le logiciel libre communautaire | Grandes organisations, DevSecOps |

## Installation sous Linux (binaire)

```bash
sudo adduser --system --shell /bin/bash --gecos 'Git' --group --disabled-password --home /home/git git
VER=1.24.6
sudo wget -O /usr/local/bin/gitea https://dl.gitea.com/gitea/${VER}/gitea-${VER}-linux-amd64
sudo chmod +x /usr/local/bin/gitea
sudo mkdir -p /var/lib/gitea/{custom,data,log} /etc/gitea
sudo chown -R git:git /var/lib/gitea && sudo chmod -R 750 /var/lib/gitea
sudo chown root:git /etc/gitea && sudo chmod 770 /etc/gitea      # repassé en 750 après l'installation
```

```ini /etc/systemd/system/gitea.service
[Unit]
Description=Gitea
After=network.target postgresql.service

[Service]
User=git
Group=git
WorkingDirectory=/var/lib/gitea/
ExecStart=/usr/local/bin/gitea web --config /etc/gitea/app.ini
Restart=always
Environment=USER=git HOME=/home/git GITEA_WORK_DIR=/var/lib/gitea

[Install]
WantedBy=multi-user.target
```

```bash
# Base PostgreSQL (recommandée ; SQLite convient aux petites instances)
sudo -u postgres psql -c "CREATE ROLE gitea LOGIN PASSWORD 'MotDePasse';"
sudo -u postgres psql -c "CREATE DATABASE gitea OWNER gitea ENCODING 'UTF8' TEMPLATE template0;"
sudo systemctl daemon-reload && sudo systemctl enable --now gitea
```

Ouvrez `http://serveur:3000` : l'**assistant d'installation** écrit `/etc/gitea/app.ini` (base, URL, SSH, compte administrateur). Ensuite :

```bash
sudo chmod 750 /etc/gitea && sudo chmod 640 /etc/gitea/app.ini
```

## Docker

```yaml compose.yaml
services:
  gitea:
    image: docker.gitea.com/gitea:1.24-rootless
    restart: unless-stopped
    environment:
      GITEA__database__DB_TYPE: postgres
      GITEA__database__HOST: db:5432
      GITEA__database__NAME: gitea
      GITEA__database__USER: gitea
      GITEA__database__PASSWD: MotDePasse
    volumes:
      - gitea-data:/var/lib/gitea
      - gitea-config:/etc/gitea
    ports:
      - "127.0.0.1:3000:3000"
      - "2222:2222"
    depends_on: [ db ]
  db:
    image: postgres:17
    environment: { POSTGRES_USER: gitea, POSTGRES_PASSWORD: MotDePasse, POSTGRES_DB: gitea }
    volumes: [ gitea-db:/var/lib/postgresql/data ]
volumes: { gitea-data: {}, gitea-config: {}, gitea-db: {} }
```

Les variables `GITEA__section__CLE` surchargent `app.ini`.

## Windows et macOS

| Système | Installation |
| --- | --- |
| Windows | `gitea-<version>-windows-4.0-amd64.exe` renommé `gitea.exe` ; service : `sc.exe create gitea start= auto binPath= "\"C:\gitea\gitea.exe\" web --config \"C:\gitea\custom\conf\app.ini\""` |
| macOS | `brew install gitea && brew services start gitea` |

## Reverse proxy

```nginx /etc/nginx/sites-available/gitea.conf
server {
    listen 443 ssl;
    http2 on;
    server_name git.corp.exemple.fr;
    ssl_certificate     /etc/ssl/certs/git.crt;
    ssl_certificate_key /etc/ssl/private/git.key;
    client_max_body_size 512m;                    # pushes et paquets volumineux

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`ROOT_URL` dans `app.ini` doit correspondre à l'URL publique (`https://git.corp.exemple.fr/`).

## Suite du parcours

1. [[02-configuration-securite|Configuration, LDAP, SSH et Actions]]
2. [[03-exploitation-depannage|Exploitation et dépannage]]

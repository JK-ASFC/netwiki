---
title: Présentation, installation et migration
description: Forgejo, fork communautaire de Gitea hébergé par Codeberg — historique, gouvernance et licence GPL, différences avec Gitea, versions LTS, installation (binaire signé, systemd, Docker), configuration commune avec Gitea, et migration depuis une instance Gitea existante.
tags: [forgejo, gitea, codeberg, forge, installation, migration, gpl]
icon: info
---

**Forgejo** est né fin 2022 d'un fork de [[03-gitea/01-presentation-installation|Gitea]], lorsque la marque et les domaines de Gitea ont été transférés à une société commerciale. Le projet est hébergé par l'association **Codeberg e.V.** (qui l'utilise pour sa propre forge publique) et gouverné par sa communauté. Devenu un fork **indépendant** en 2024, il est publié sous licence **GPLv3+** depuis la version 9.

## Différences avec Gitea

| Sujet | Forgejo |
| --- | --- |
| Gouvernance | Communautaire, décisions publiques |
| Licence | GPLv3+ (Gitea : MIT) |
| Numérotation | Versions majeures (v11, v12…) avec branches **LTS** |
| Fonctions propres | Fédération (ForgeFed, en cours), modération, améliorations de sécurité et de qualité, Forgejo Actions |
| Compatibilité | Configuration (`app.ini`), CLI et API largement identiques à Gitea |
| Migration depuis Gitea | Possible depuis **Gitea ≤ 1.22** ; les versions plus récentes de Gitea ont divergé |

## Installation (binaire)

```bash
sudo adduser --system --shell /bin/bash --gecos 'Git' --group --disabled-password --home /home/git git
VER=11.0.6
sudo wget -O /usr/local/bin/forgejo https://codeberg.org/forgejo/forgejo/releases/download/v${VER}/forgejo-${VER}-linux-amd64
sudo chmod +x /usr/local/bin/forgejo
# Vérification de la signature (recommandée)
wget https://codeberg.org/forgejo/forgejo/releases/download/v${VER}/forgejo-${VER}-linux-amd64.asc
# Importer la clé de publication indiquée dans la documentation d'installation de Forgejo, puis :
gpg --verify forgejo-${VER}-linux-amd64.asc /usr/local/bin/forgejo

sudo mkdir -p /var/lib/forgejo /etc/forgejo
sudo chown git:git /var/lib/forgejo && sudo chmod 750 /var/lib/forgejo
sudo chown root:git /etc/forgejo && sudo chmod 770 /etc/forgejo
```

```ini /etc/systemd/system/forgejo.service
[Unit]
Description=Forgejo
After=network.target postgresql.service

[Service]
User=git
Group=git
WorkingDirectory=/var/lib/forgejo/
ExecStart=/usr/local/bin/forgejo web --config /etc/forgejo/app.ini
Restart=always
Environment=USER=git HOME=/home/git FORGEJO_WORK_DIR=/var/lib/forgejo

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now forgejo
# Assistant d'installation sur http://serveur:3000, puis :
sudo chmod 750 /etc/forgejo && sudo chmod 640 /etc/forgejo/app.ini
```

## Docker

```bash
docker run -d --name forgejo --restart unless-stopped \
  -p 127.0.0.1:3000:3000 -p 2222:22 \
  -v forgejo-data:/data \
  codeberg.org/forgejo/forgejo:11
```

Variantes *rootless* disponibles (`:11-rootless`). Windows : binaire Windows comme service (même méthode que Gitea) ; macOS : `brew install forgejo`.

## Configuration

`app.ini`, LDAP, SSH, reverse proxy, registre de paquets et sécurité se configurent comme pour Gitea : voir [[03-gitea/02-configuration-securite|configuration de Gitea]]. Les variables d'environnement utilisent le préfixe `FORGEJO__section__CLE`.

## Migrer depuis Gitea

1. Vérifier la version de Gitea (≤ 1.22 pour une migration directe).
2. Sauvegarder (`gitea dump` + base de données).
3. Arrêter Gitea, remplacer le binaire par celui de Forgejo (la version indiquée dans le guide de migration correspondant), pointer vers le même `app.ini` et le même répertoire de travail.
4. Démarrer : les migrations de base s'appliquent ; vérifier avec `forgejo doctor check --all`.

## Suite

[[02-actions-exploitation|Forgejo Actions et exploitation]]

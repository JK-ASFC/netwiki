---
title: Ghost
description: Ghost (MIT, Node.js) — plateforme de publication et de newsletter (articles, abonnements gratuits et payants, envoi de lettres d'information) : prérequis (Ubuntu 22.04/24.04, Node.js LTS, MySQL 8, NGINX), installation par Ghost-CLI (ghost install, certificat, systemd), Docker (image officielle ghost, variables url et database__*), configuration config.production.json (courriel Mailgun ou SMTP), administration /ghost, sauvegarde, mise à jour (ghost update) et dépannage (ghost doctor, ghost log).
tags: [ghost, blog, newsletter, nodejs, mysql, cms]
icon: feather
---

**Ghost** (MIT) est une plateforme de **publication** moderne en Node.js : éditeur riche, pages, étiquettes, **membres** et abonnements (gratuits ou payants via Stripe), **newsletters** envoyées depuis Ghost, thèmes Handlebars, API de contenu pour un site *headless*. Il convient aux blogs d'entreprise, sites d'actualité et lettres d'information. Version 6 actuellement.

Prérequis (installation recommandée) : **Ubuntu 22.04 ou 24.04**, Node.js en version LTS prise en charge, **MySQL 8**, NGINX, 1 Go de RAM au moins, un utilisateur non `root` avec `sudo`.

## Installation avec Ghost-CLI

```bash
sudo apt install -y nginx mysql-server
sudo mysql -e "CREATE USER 'ghost'@'localhost' IDENTIFIED BY 'MdpGhost2026'; CREATE DATABASE ghost_prod; GRANT ALL ON ghost_prod.* TO 'ghost'@'localhost';"
# Node.js LTS (dépôt NodeSource ou paquet de la distribution s'il est pris en charge), puis :
sudo npm install ghost-cli@latest -g
sudo mkdir -p /var/www/ghost && sudo chown $USER:$USER /var/www/ghost && sudo chmod 775 /var/www/ghost
cd /var/www/ghost && ghost install
```

L'assistant demande l'**URL** (`https://blog.corp.exemple.fr`), la base MySQL, configure NGINX, obtient un certificat Let's Encrypt et crée le service systemd. Configuration : `/var/www/ghost/config.production.json` (URL, base, `mail` : SMTP ou Mailgun pour les newsletters de masse).

## Docker

```yaml
services:
  ghost:
    image: ghost:6
    ports: ["127.0.0.1:2368:2368"]
    environment:
      url: https://blog.corp.exemple.fr
      database__client: mysql
      database__connection__host: db
      database__connection__user: ghost
      database__connection__password: MdpGhost2026
      database__connection__database: ghost
    volumes: ["ghost-content:/var/lib/ghost/content"]
    depends_on: [db]
  db:
    image: mysql:8.4
    environment: { MYSQL_DATABASE: ghost, MYSQL_USER: ghost, MYSQL_PASSWORD: MdpGhost2026, MYSQL_RANDOM_ROOT_PASSWORD: "1" }
    volumes: ["db-data:/var/lib/mysql"]
volumes: { ghost-content: {}, db-data: {} }
```

Fonctionne sous Windows et macOS avec Docker Desktop (Ghost-CLI y sert seulement au développement : `ghost install local`).

## Administration

`https://blog.corp.exemple.fr/ghost` : le premier écran crée le **propriétaire** du site. Menus : *Posts*, *Pages*, *Tags*, *Members* (abonnés, offres), *Newsletters*, *Settings* (titre, langue `fr`, navigation, thème, intégrations, utilisateurs et rôles : *Contributor*, *Author*, *Editor*, *Administrator*).

<!-- CAPTURE: Éditeur d'article Ghost | _assets/ghost-editeur.png -->

## Exploitation

```bash
cd /var/www/ghost
ghost ls ; ghost status
ghost log ; ghost doctor
ghost restart
ghost update                                    # mise à jour (sauvegarde automatique du contenu avant migration)
mysqldump --single-transaction ghost_prod > /srv/sauvegardes/ghost-$(date +%F).sql
tar czf /srv/sauvegardes/ghost-contenu-$(date +%F).tar.gz -C /var/www/ghost content
```

Exporter aussi le contenu depuis *Settings → Labs → Export* (JSON) et la liste des membres (CSV).

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| `ghost install` refuse de continuer | Utilisateur `root`, version de Node non prise en charge | Utilisateur dédié avec `sudo`, Node LTS |
| Liens en `http://` ou boucle de redirection | `url` incorrecte, en-têtes du proxy | `url` en `https://`, `X-Forwarded-Proto` |
| Newsletters non envoyées | Courriel de masse non configuré | Mailgun (ou SMTP pour les courriels de service) dans la configuration |

Commandes : [[90-aide-memoire|aide-mémoire]].

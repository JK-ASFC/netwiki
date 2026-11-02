---
title: osTicket
description: osTicket (GPL v2) — système de tickets libre en PHP : prérequis (PHP 8.2 à 8.4, MySQL 5.5+ ou MariaDB, extensions), installation sous Linux (Apache ou NGINX), Windows (IIS) et Docker, assistant web, sécurisation (ost-config.php, suppression de setup/), tâche planifiée api/cron.php, départements, équipes, rubriques d'aide, files, SLA, règles de filtrage, réponses prédéfinies, base de connaissances, LDAP/Active Directory, sauvegarde, mise à jour et dépannage.
tags: [osticket, helpdesk, tickets, php, mysql, windows, iis]
icon: ticket
---

**osTicket** (GPL v2) est l'un des systèmes de tickets libres les plus répandus : les demandes arrivent par **courriel**, **formulaire web** (portail client) ou **API**, sont classées par **rubrique d'aide** et **département**, affectées à des agents et suivies avec des **SLA**. Simple et robuste, il convient aux services informatiques et aux équipes de support de petite et moyenne taille. Alternatives : [[04-glpi-installation|GLPI]] (avec gestion de parc), [[06-zammad|Zammad]], [[13-freescout|FreeScout]].

## Prérequis

- **PHP 8.2 à 8.4** (8.4 recommandé) avec `mysqli`, `gd`, `imap`, `xml`, `json`, `mbstring`, `intl`, `zip`, OPcache et **APCu** ;
- **MySQL 5.5+** ou MariaDB ;
- Apache, NGINX ou IIS sous Linux, Windows ou macOS.

## Installation sous Linux (Apache)

```bash
sudo apt install -y apache2 mariadb-server unzip php8.4 libapache2-mod-php8.4 php8.4-mysql php8.4-gd php8.4-imap php8.4-xml php8.4-mbstring php8.4-intl php8.4-zip php8.4-apcu
sudo mariadb -e "CREATE DATABASE osticket CHARACTER SET utf8mb4; CREATE USER 'osticket'@'localhost' IDENTIFIED BY 'MdpOsticket2026'; GRANT ALL ON osticket.* TO 'osticket'@'localhost';"
V=1.18.4
wget https://github.com/osTicket/osTicket/releases/download/v$V/osTicket-v$V.zip
unzip osTicket-v$V.zip -d osticket
sudo mkdir -p /var/www/osticket && sudo cp -r osticket/upload/* /var/www/osticket/
sudo cp /var/www/osticket/include/ost-sampleconfig.php /var/www/osticket/include/ost-config.php
sudo chown -R www-data:www-data /var/www/osticket && sudo chmod 0666 /var/www/osticket/include/ost-config.php
```

Sous RHEL/Rocky : `dnf install httpd mariadb-server php php-mysqlnd php-gd php-imap php-xml php-mbstring php-intl php-pecl-apcu`, contexte SELinux `httpd_sys_rw_content_t` sur `include/ost-config.php` pendant l'installation. Sous **Windows** : IIS avec PHP (FastCGI) et MySQL/MariaDB, mêmes étapes (copie du dossier `upload` dans `C:\inetpub\osticket`). **Docker** : pas d'image officielle ; des images communautaires existent (vérifier leur maintenance) ou construire la sienne sur `php:8.4-apache`.

Ouvrir `https://aide.corp.exemple.fr/setup/` : nom du service, adresse par défaut, compte administrateur, paramètres de base. Ensuite, **impérativement** :

```bash
sudo chmod 0644 /var/www/osticket/include/ost-config.php
sudo rm -rf /var/www/osticket/setup
```

Tâche planifiée (relève des courriels, alertes de dépassement de SLA, nettoyage) :

```bash
echo '*/5 * * * * www-data /usr/bin/php /var/www/osticket/api/cron.php' | sudo tee /etc/cron.d/osticket
```

Sous Windows : tâche planifiée `php.exe C:\inetpub\osticket\api\cron.php` toutes les 5 minutes.

## Configuration

Panneau d'administration : `https://aide.corp.exemple.fr/scp/` → **Panneau d'administration**.

| Menu | Usage |
| --- | --- |
| Paramètres → Système, Tickets, Courriels | Langue, fuseau, numérotation, priorité, taille des pièces jointes |
| Courriels → Adresses | Boîtes relevées (IMAP/POP), SMTP sortant, OAuth Microsoft 365 / Google |
| Gestion → Rubriques d'aide | Catégories proposées au demandeur, département et SLA associés |
| Gestion → Règles de filtrage | Router ou rejeter selon l'expéditeur, l'objet, le contenu |
| Gestion → Plans SLA | Délais de réponse et de résolution, calendriers |
| Agents → Agents, Équipes, Rôles, Départements | Comptes, permissions, files d'attente |
| Gestion → Formulaires | Champs personnalisés du ticket et de l'utilisateur |
| Gestion → Extensions | Authentification **LDAP/Active Directory**, OAuth 2, stockage des pièces jointes sur disque |

<!-- CAPTURE: File de tickets osTicket (panneau agent) | _assets/osticket-file-tickets.png -->
<!-- CAPTURE: Panneau d'administration, Rubriques d'aide | _assets/osticket-rubriques.png -->

Côté agent (`/scp/`) : files *Ouverts*, *Attribués à moi*, *En retard*, réponses prédéfinies, notes internes, fusion et transfert de tickets, base de connaissances (FAQ publiées sur le portail client).

## Sauvegarde, mise à jour

- Sauvegarde : base (`mysqldump osticket`), `include/ost-config.php` (contient le `SECRET_SALT`) et le dossier de pièces jointes si l'extension de stockage sur disque est utilisée.
- Mise à jour : sauvegarder, remplacer les fichiers par le dossier `upload` de la nouvelle version (sans écraser `ost-config.php`), ouvrir `/scp/` : l'assistant de mise à jour applique les migrations de base.

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Avertissement « setup directory exists » | Dossier `setup/` laissé en place | Le supprimer |
| Courriels non relevés | Tâche cron absente, extension `imap`, OAuth | Cron `api/cron.php`, paramètres de l'adresse |
| Erreur « ost-config.php writable » | Droits restés en 0666 | `chmod 0644` |
| Pièces jointes refusées | Taille maximale PHP ou osTicket | `upload_max_filesize`, *Paramètres → Tickets* |

Commandes : [[90-aide-memoire|aide-mémoire]].

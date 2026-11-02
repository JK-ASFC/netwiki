---
title: FreeScout
description: FreeScout (AGPL) — helpdesk et boîte de courriel partagée auto-hébergée, alternative à Help Scout : prérequis (PHP 8.2+, MySQL/MariaDB ou PostgreSQL, NGINX ou Apache), installation par script officiel sur Ubuntu/Debian, installation manuelle (branche dist, droits, artisan), Docker, tâche planifiée schedule:run, boîtes aux lettres IMAP/SMTP et OAuth Microsoft 365/Google, modules, mises à jour, commandes artisan, sauvegarde et dépannage.
tags: [freescout, helpdesk, boîte partagée, courriel, php, laravel, tickets]
icon: inbox
---

**FreeScout** (AGPL) transforme une ou plusieurs adresses de courriel (`support@corp.exemple.fr`) en **boîte partagée** : chaque message devient une conversation que les agents s'attribuent, commentent par notes internes et suivent jusqu'à la clôture, sans que le client sorte de sa messagerie. Léger (PHP/Laravel), il tourne sur un petit serveur. De nombreuses fonctions (chat, base de connaissances, SLA, LDAP, intégrations) sont des **modules** payants à l'unité. Alternatives : [[06-zammad|Zammad]], [[14-osticket|osTicket]], [[12-chatwoot|Chatwoot]].

## Prérequis

- Linux (Ubuntu/Debian conseillés), Windows (IIS ou Apache) ou hébergement mutualisé ; **PHP 8.2 ou plus récent** (éviter PHP 8.1) avec les extensions `mysql`, `mbstring`, `xml`, `zip`, `gd`, `curl`, `intl` ;
- MySQL 5+, MariaDB 5+ ou PostgreSQL ;
- NGINX ou Apache, un nom DNS (`aide.corp.exemple.fr`) et une boîte aux lettres IMAP/SMTP.

## Installation par script (Ubuntu / Debian)

```bash
sudo apt install -y wget
wget https://raw.githubusercontent.com/freescout-help-desk/freescout/dist/tools/install.sh
chmod u+x install.sh
sudo ./install.sh       # NGINX, PHP-FPM, MySQL, certificat Let's Encrypt et cron : questions interactives
```

## Installation manuelle

```bash
sudo apt install -y nginx mariadb-server git php8.4-fpm php8.4-mysql php8.4-mbstring php8.4-xml php8.4-zip php8.4-gd php8.4-curl php8.4-intl
sudo mariadb -e "CREATE DATABASE freescout CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER 'freescout'@'localhost' IDENTIFIED BY 'MdpFreescout2026'; GRANT ALL ON freescout.* TO 'freescout'@'localhost';"
sudo mkdir -p /var/www/freescout && sudo chown www-data:www-data /var/www/freescout
cd /var/www/freescout && sudo -u www-data git clone -b dist https://github.com/freescout-help-desk/freescout .
```

La branche **`dist`** contient déjà les dépendances Composer. Virtual host NGINX : racine `/var/www/freescout/public`, `try_files $uri $uri/ /index.php?$query_string;` et passage des `.php` à PHP-FPM. Ouvrir ensuite `https://aide.corp.exemple.fr/install` : l'assistant vérifie les prérequis, écrit le fichier `.env` (base, adresse de l'application) et crée l'administrateur.

**Tâche planifiée** (indispensable : récupération des courriels, envois, notifications) :

```bash
sudo crontab -u www-data -e
* * * * * php /var/www/freescout/artisan schedule:run >> /dev/null 2>&1
```

**Docker** : une image communautaire est référencée sur le site du projet (page *Docker* de freescout.net) ; elle embarque NGINX, PHP et la tâche planifiée. Prévoir un conteneur MariaDB et un volume persistant pour les données et les modules.

## Configuration

| Menu | Usage |
| --- | --- |
| Gérer → Boîtes aux lettres | Adresse, signature, **connexion entrante** (IMAP, dossier, fréquence) et **sortante** (SMTP ou `sendmail`), répondeur automatique |
| Gérer → Utilisateurs | Agents, administrateurs, accès par boîte aux lettres |
| Gérer → Paramètres | Langue, fuseau horaire, format des courriels, journal |
| Gérer → Modules | Installer et activer les modules (licences) |
| Gérer → Système | État des tâches planifiées, files, version de PHP, mise à jour en un clic |

Microsoft 365 et Google Workspace exigent l'**OAuth 2.0** pour IMAP/SMTP : enregistrer une application (Entra ID ou Google Cloud), puis choisir *OAuth* dans les paramètres de connexion de la boîte.

<!-- CAPTURE: Boîte aux lettres FreeScout avec liste de conversations | _assets/freescout-conversations.png -->
<!-- CAPTURE: Paramètres de connexion entrante IMAP d'une boîte aux lettres | _assets/freescout-imap.png -->

## Exploitation

```bash
cd /var/www/freescout
sudo -u www-data php artisan freescout:fetch-emails          # relève immédiate des courriels
sudo -u www-data php artisan freescout:create-user           # créer un utilisateur (administrateur perdu)
sudo -u www-data php artisan freescout:clear-cache
sudo -u www-data php artisan queue:work --once              # traiter un élément de file (diagnostic)
sudo -u www-data /var/www/freescout/tools/update.sh          # mise à jour par la console
```

- **Mise à jour** : *Gérer → Système* (bouton), script `tools/update.sh` ou `git pull` de la branche `dist` puis `php artisan freescout:after-app-update`. Ne jamais modifier `APP_KEY` dans `.env` : il chiffre les mots de passe des boîtes aux lettres.
- **Sauvegarde** : base (`mysqldump freescout`), dossier `storage/` (pièces jointes) et `.env`.

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Aucun nouveau courriel | Tâche cron absente ou PHP CLI différent | Ligne `schedule:run` pour `www-data`, *Gérer → Système* |
| Envoi bloqué, « Sending issues » | SMTP refusé, OAuth expiré | Paramètres de connexion sortante, nouvelle autorisation OAuth |
| Page blanche après mise à jour | Cache ou droits | `freescout:clear-cache`, `chown -R www-data:` |
| Courriels relevés en double | Deux tâches cron concurrentes | Garder une seule ligne `schedule:run` |

Commandes : [[90-aide-memoire|aide-mémoire]].

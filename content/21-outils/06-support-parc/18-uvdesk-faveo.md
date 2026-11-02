---
title: UVdesk et Faveo Helpdesk
description: UVdesk Community (Symfony, OSL 3.0) et Faveo Helpdesk Community (Laravel, OSL 3.0) — helpdesks libres en PHP : fonctions (tickets par courriel et formulaire, équipes, groupes, SLA, base de connaissances, portail client), prérequis (PHP 8.1+, IMAP, Mailparse, MySQL 5.7+/8, MariaDB 10.6), installation Linux et Windows (composer create-project, installateur web), configuration des boîtes IMAP et SMTP, tâches planifiées, sauvegarde, mise à jour et limites des éditions communautaires.
tags: [uvdesk, faveo, helpdesk, tickets, php, symfony, laravel]
icon: headset
---

Deux helpdesks PHP sous licence **OSL 3.0**, adaptés aux petites équipes de support qui veulent une interface web moderne sans infrastructure lourde. Leurs éditeurs vendent des éditions commerciales plus riches : vérifier que l'édition communautaire couvre le besoin, et comparer avec [[14-osticket|osTicket]], [[13-freescout|FreeScout]] ou [[06-zammad|Zammad]], plus actifs côté libre.

| | UVdesk Community | Faveo Helpdesk Community |
| --- | --- | --- |
| Socle | Symfony (PHP 8.1+) | Laravel (PHP 8.1+) |
| Base | MySQL 5.7.23+ | MySQL 8.0 ou MariaDB 10.6 |
| Canaux | Courriel (IMAP), formulaire, portail client | Courriel, formulaire, portail client |
| Fonctions | Équipes, groupes, flux de travail automatisés, réponses enregistrées, base de connaissances, applications (marketplace) | Départements, équipes, SLA, rubriques d'aide, base de connaissances |
| Serveurs web | Apache, NGINX | Apache, NGINX, IIS |

## UVdesk Community

Prérequis : PHP 8.1 avec les extensions **IMAP** et **Mailparse**, Composer, MySQL 5.7.23+.

```bash
sudo apt install -y apache2 mariadb-server composer php8.4 libapache2-mod-php8.4 php8.4-mysql php8.4-imap php8.4-mailparse php8.4-xml php8.4-mbstring php8.4-curl php8.4-zip php8.4-intl
sudo mariadb -e "CREATE DATABASE uvdesk CHARACTER SET utf8mb4; CREATE USER 'uvdesk'@'localhost' IDENTIFIED BY 'MdpUvdesk2026'; GRANT ALL ON uvdesk.* TO 'uvdesk'@'localhost';"
cd /var/www && sudo composer create-project uvdesk/community-skeleton helpdesk
sudo chown -R www-data:www-data /var/www/helpdesk
```

Virtual host avec la racine `/var/www/helpdesk/public` (réécriture d'URL active), puis ouvrir `https://helpdesk.corp.exemple.fr/` : l'**installateur web** vérifie les prérequis, configure la base, crée le compte administrateur et les préfixes d'URL. Alternative en ligne de commande : `php bin/console uvdesk:configure-helpdesk`.

| Accès | Adresse par défaut |
| --- | --- |
| Agents et administrateurs | `https://helpdesk.corp.exemple.fr/fr/member/login` |
| Clients | `https://helpdesk.corp.exemple.fr/fr/customer/login` |

Sous Windows : pile WAMP ou IIS + PHP avec les mêmes extensions, puis `composer create-project`. Le projet propose aussi des procédures Docker (exécution et conteneur persistant) dans son dépôt.

<!-- CAPTURE: Liste des tickets UVdesk (espace agent) | _assets/uvdesk-tickets.png -->

Configuration : *Paramètres → Mailboxes* (boîte IMAP relevée et adresse SMTP de réponse), *Swift Mailer* (SMTP sortant), *Workflows* (règles automatiques), *Équipes* et *Groupes* (affectation). Relève des courriels par tâche planifiée :

```bash
echo '*/5 * * * * www-data cd /var/www/helpdesk && php bin/console uvdesk:refresh-mailbox support@corp.exemple.fr' | sudo tee /etc/cron.d/uvdesk
```

Vider le cache après une modification : `sudo -u www-data php /var/www/helpdesk/bin/console cache:clear`.

## Faveo Helpdesk Community

Prérequis : PHP 8.1+ (extensions IMAP, Mbstring, OpenSSL, PDO, Tokenizer, XML, Zip), MySQL 8.0 ou MariaDB 10.6, réécriture d'URL activée sur Apache, NGINX ou IIS.

```bash
cd /var/www && sudo git clone https://github.com/ladybirdweb/faveo-helpdesk.git faveo
cd faveo && sudo composer install --no-dev
sudo chown -R www-data:www-data /var/www/faveo
```

Racine web : `/var/www/faveo/public`. L'assistant d'installation (première ouverture du site) configure la base, l'administrateur et la licence de l'édition communautaire. Ajouter la tâche planifiée Laravel :

```bash
echo '* * * * * www-data php /var/www/faveo/artisan schedule:run >> /dev/null 2>&1' | sudo tee /etc/cron.d/faveo
```

Sous Windows (IIS) : site pointant sur `public`, module *URL Rewrite*, PHP FastCGI, et tâche planifiée `php artisan schedule:run` chaque minute.

<!-- CAPTURE: Tableau de bord agent de Faveo | _assets/faveo-tableau-de-bord.png -->

## Exploitation commune

- **Sauvegarde** : base MySQL/MariaDB (`mysqldump`), fichiers envoyés (`public/` ou `storage/`), fichier `.env`.
- **Mise à jour** : sauvegarder, mettre à jour le code (`composer update` pour UVdesk selon les notes de version, nouvelle version pour Faveo), appliquer les migrations (`php bin/console doctrine:migrations:migrate` / `php artisan migrate`), vider les caches.
- **Sécurité** : HTTPS, pas d'installateur laissé accessible, comptes agents nominatifs.

Commandes : [[90-aide-memoire|aide-mémoire]].

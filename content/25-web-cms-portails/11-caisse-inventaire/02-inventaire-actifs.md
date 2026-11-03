---
title: InvenTree, Snipe-IT, OpenBoxes et FusionInventory
description: Gestion de stocks et d'actifs — InvenTree (MIT, Django : pièces, nomenclatures, stocks, fournisseurs, commandes, étiquettes, API ; installateur get.inventree.org, Docker, invoke), Snipe-IT (AGPL, Laravel : gestion des actifs informatiques, licences, consommables, affectations, check-in/out, LDAP ; git, composer, php artisan, assistant /setup, Docker snipe/snipe-it), OpenBoxes (EPL, Java : chaîne d'approvisionnement santé et humanitaire) et FusionInventory (plugin GLPI abandonné, remplacé par l'inventaire natif de GLPI et l'agent GLPI).
tags: [inventree, snipe-it, openboxes, fusioninventory, glpi, inventaire, actifs]
icon: package-search
---

| Outil | Licence | Domaine |
| --- | --- | --- |
| **InvenTree** | MIT | Pièces et composants (électronique, maintenance, atelier), nomenclatures, stocks |
| **Snipe-IT** | AGPL v3 | **Actifs informatiques** : matériels, licences, accessoires, consommables, affectations |
| **OpenBoxes** | EPL | Chaîne d'approvisionnement (santé, humanitaire) : entrepôts, lots, péremptions |
| FusionInventory | AGPL | Ancien inventaire pour GLPI : **abandonné**, voir [[06-support-parc/05-glpi-inventaire-assistance\|GLPI]] |

## InvenTree

```bash
wget -qO install.sh https://get.inventree.org && bash install.sh       # paquet pour les distributions prises en charge (Debian, Ubuntu)
```

Ou Docker Compose (fichiers `docker-compose.yml` et `.env` de la documentation : serveur, worker, PostgreSQL, Redis, proxy Caddy). Première installation en conteneur :

```bash
docker compose run --rm inventree-server invoke update        # migrations et fichiers statiques
docker compose run --rm inventree-server invoke superuser      # premier administrateur
docker compose up -d
```

Fonctions : catégories et paramètres de pièces, emplacements, numéros de série et lots, **nomenclatures** (BOM) et ordres de fabrication, achats et ventes, étiquettes et rapports, application mobile, API REST. Sauvegarde : `invoke backup` (base et médias) ou dump PostgreSQL + dossier `media`.

<!-- CAPTURE: Fiche d'une pièce InvenTree avec stocks par emplacement | _assets/inventree-piece.png -->

## Snipe-IT

```bash
sudo apt install -y nginx mariadb-server git composer php-fpm php-mysql php-bcmath php-curl php-gd php-ldap php-mbstring php-xml php-zip php-intl
sudo mariadb -e "CREATE DATABASE snipeit CHARACTER SET utf8mb4; CREATE USER 'snipeit'@'localhost' IDENTIFIED BY 'MdpSnipeit2026'; GRANT ALL ON snipeit.* TO 'snipeit'@'localhost';"
cd /var/www && sudo git clone https://github.com/grokability/snipe-it snipe-it && cd snipe-it
sudo cp .env.example .env        # APP_URL=https://actifs.corp.exemple.fr, APP_TIMEZONE, DB_DATABASE, DB_USERNAME, DB_PASSWORD, MAIL_*
sudo composer install --no-dev --prefer-source
sudo php artisan key:generate
sudo chown -R www-data:www-data storage public/uploads bootstrap/cache
```

Racine web : `public/`. Ouvrir `https://actifs.corp.exemple.fr/setup` : vérification, migrations, compte administrateur. Docker : image `snipe/snipe-it` avec un fichier d'environnement reprenant les mêmes variables et une base MariaDB. Sous Windows (IIS) et macOS : mêmes prérequis PHP.

Paramétrage : modèles, catégories, fabricants, emplacements, **champs personnalisés** (adresse MAC, numéro de série), étiquettes avec QR code, synchronisation **LDAP/AD** (`php artisan snipeit:ldap-sync`), import CSV, alertes de fin de garantie, API REST (inventaire automatique depuis des scripts).

```bash
cd /var/www/snipe-it
sudo -u www-data php artisan snipeit:backup                 # base et fichiers dans storage/app/backups
sudo -u www-data php artisan snipeit:ldap-sync
git pull && composer install --no-dev && php artisan migrate --force && php artisan config:clear    # mise à jour
```

Tâche planifiée Laravel : `* * * * * www-data php /var/www/snipe-it/artisan schedule:run` (alertes, sauvegardes planifiées).

<!-- CAPTURE: Liste des actifs Snipe-IT | _assets/snipeit-actifs.png -->

## OpenBoxes

Application **Java/Grails** pour la gestion de stocks dans la santé et l'humanitaire (entrepôts multiples, lots et dates de péremption, demandes et expéditions entre sites). Déploiement : fichier WAR sur Tomcat avec MySQL/MariaDB, ou images Docker du projet ; configuration dans `openboxes.yml` (base, courriel). Compte initial indiqué par la documentation, à changer.

## FusionInventory

Le plugin FusionInventory pour GLPI n'est plus maintenu depuis l'intégration de l'**inventaire natif** dans GLPI 10. Migrer : activer l'inventaire dans GLPI (*Administration → Inventaire*), déployer l'**agent GLPI** (`glpi-agent`, successeur de l'agent FusionInventory, compatible Windows, Linux, macOS) et pointer les agents vers `https://glpi.corp.exemple.fr/front/inventory.php`.

Commandes : [[90-aide-memoire|aide-mémoire]].

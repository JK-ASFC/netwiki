---
title: iDempiere, metasfresh, Apache OFBiz, ERP5 et FrontAccounting
description: Autres ERP libres — iDempiere (GPL, Java, héritier de Compiere/ADempiere : Docker idempiereofficial/idempiere avec PostgreSQL, HTTPS 8443, /webui), metasfresh (GPL, Java : pile Docker Compose officielle), Apache OFBiz (Apache 2.0, Java : gradlew cleanAll loadAll ofbiz, interfaces sur 8443), ERP5 (GPL, Python/Zope, déployé par SlapOS) et FrontAccounting (GPL, PHP : comptabilité et gestion pour petites entreprises, assistant d'installation), choix, installation et exploitation.
tags: [idempiere, metasfresh, ofbiz, erp5, frontaccounting, erp, java]
icon: warehouse
---

| ERP | Licence | Socle | Cible |
| --- | --- | --- | --- |
| **iDempiere** | GPL v2 | Java, PostgreSQL (ou Oracle) | Distribution, industrie, multi-société ; communauté internationale |
| **metasfresh** | GPL v2 | Java, PostgreSQL | Négoce, distribution (Allemagne) |
| **Apache OFBiz** | Apache 2.0 | Java (cadriciel) | Base de développement d'ERP et de commerce sur mesure |
| **ERP5** | GPL v3 | Python, Zope, NEO | Grands projets (Nexedi), déploiement SlapOS |
| **FrontAccounting** | GPL v3 | PHP, MySQL | Comptabilité et gestion des petites entreprises |

Choix plus courants : [[01-odoo|Odoo]], [[02-frappe-erpnext|ERPNext]], [[03-dolibarr-tryton|Dolibarr ou Tryton]].

## iDempiere

```bash
docker network create idempiere
docker run -d --name postgres --network idempiere -e POSTGRES_PASSWORD=MdpPostgres2026 -v idempiere-pg:/var/lib/postgresql/data postgres:16
docker run -d --name idempiere --network idempiere -p 8443:8443 -e DB_HOST=postgres -e DB_ADMIN_PASS=MdpPostgres2026 idempiereofficial/idempiere:13-release
```

Interface : `https://srv-erp-01:8443/webui/` (le HTTP direct n'est plus pris en charge depuis la version 9). Le conteneur initialise la base au premier démarrage avec les données de démonstration *GardenWorld* (comptes `SuperUser` et `GardenAdmin`, mots de passe par défaut à changer). Installation hors Docker : archive serveur Java (Linux, Windows) avec `console-setup.sh` puis `idempiere-server.sh`.

## metasfresh

Déploiement par la pile **Docker Compose** du dépôt `metasfresh/metasfresh-docker` (application, interface web, PostgreSQL, RabbitMQ, Elasticsearch) en suivant le guide d'installation Docker du projet (versions HTTP et HTTPS). Prévoir 8 Go de RAM. Interface web sur le port publié par la pile ; comptes initiaux indiqués dans la documentation, à modifier.

## Apache OFBiz

```bash
git clone --depth 1 -b release24.09 https://github.com/apache/ofbiz-framework.git ofbiz && cd ofbiz
./gradlew cleanAll loadAll          # Windows : gradlew cleanAll loadAll (données de démonstration incluses)
./gradlew ofbiz                     # démarrage
```

Interfaces : `https://srv-erp-01:8443/ordermgr` (commandes), `/partymgr` (tiers), `/accounting`, `/webtools` (administration). Java 17 requis ; base Derby intégrée pour les essais, PostgreSQL ou MySQL en production (`framework/entity/config/entityengine.xml`). OFBiz est un cadriciel : un projet réel demande du développement.

## ERP5

**ERP5** (Nexedi) est un ERP généraliste fondé sur un modèle unifié (ressources, nœuds, mouvements), écrit en Python sur Zope. Il se déploie avec **SlapOS** (outil d'orchestration de Nexedi) sur Debian/Ubuntu ; l'installation manuelle n'est pas recommandée. À réserver aux projets accompagnés par l'éditeur ou une équipe expérimentée.

## FrontAccounting

```bash
sudo apt install -y apache2 mariadb-server php libapache2-mod-php php-mysql php-gd php-mbstring php-xml php-zip
sudo mariadb -e "CREATE DATABASE frontacc CHARACTER SET utf8mb4; CREATE USER 'frontacc'@'localhost' IDENTIFIED BY 'MdpFrontacc2026'; GRANT ALL ON frontacc.* TO 'frontacc'@'localhost';"
# extraire l'archive de la dernière version (site du projet) dans /var/www/frontaccounting, puis :
sudo chown -R www-data:www-data /var/www/frontaccounting
```

Ouvrir `https://compta.corp.exemple.fr/install/` : base, société, administrateur, plan comptable (des plans français existent en extension). Supprimer le dossier `install/` ensuite. Fonctionne aussi sous Windows (WAMP) et macOS. Sauvegarde : *Configuration → Sauvegarde et restauration* ou `mysqldump`.

Commandes : [[90-aide-memoire|aide-mémoire]].

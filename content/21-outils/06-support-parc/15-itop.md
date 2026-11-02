---
title: iTop
description: iTop (Combodo, AGPL) — ITSM et CMDB libre en PHP : prérequis (PHP 8.2 à 8.4, MySQL 5.7+ ou MariaDB, extensions), installation Linux (Apache, NGINX), Windows (IIS ou WAMP), archive SourceForge, assistant /setup (modules CMDB, gestion des incidents, demandes, changements, problèmes, catalogue de services, SLA), tâche planifiée cron.php avec fichier de paramètres, synchronisation des données et LDAP, collecteurs, portail utilisateur, sauvegarde, mise à jour et dépannage.
tags: [itop, itsm, cmdb, itil, helpdesk, php, combodo]
icon: network
---

**iTop** (*IT Operations Portal*, Combodo, AGPL) est un outil **ITSM** et **CMDB** conforme aux pratiques **ITIL** : base des configurations (serveurs, réseaux, applications, contrats, contacts) avec leurs **relations** et **analyses d'impact**, gestion des **incidents**, **demandes utilisateurs**, **changements** et **problèmes**, catalogue de services, SLA et portail libre-service. Il se distingue par la richesse de son modèle de données et ses outils d'import et de synchronisation. Alternatives : [[04-glpi-installation|GLPI]] (inventaire et assistance), [[16-otobo-znuny|OTOBO / Znuny]].

## Prérequis

- **PHP 8.2 à 8.4** avec `mysqli`, `gd`, `ldap`, `mbstring`, `soap`, `xml`, `zip`, `json`, `curl`, `iconv`, `dom` ;
- **MySQL 5.7+** ou MariaDB (UTF-8 `utf8mb4`), Graphviz (`dot`) pour les graphes d'impact ;
- Apache, NGINX ou IIS ; 4 Go de RAM pour une CMDB de taille moyenne.

## Installation

```bash
sudo apt install -y apache2 mariadb-server unzip graphviz php8.4 libapache2-mod-php8.4 php8.4-mysql php8.4-gd php8.4-ldap php8.4-mbstring php8.4-soap php8.4-xml php8.4-zip php8.4-curl php8.4-apcu
sudo mariadb -e "CREATE DATABASE itop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER 'itop'@'localhost' IDENTIFIED BY 'MdpItop2026'; GRANT ALL ON itop.* TO 'itop'@'localhost';"
# archive iTop 3.x (dossier « web ») depuis sourceforge.net/projects/itop
unzip iTop-3.*.zip -d itop-archive
sudo mkdir -p /var/www/itop && sudo cp -r itop-archive/web/* /var/www/itop/
sudo chown -R www-data:www-data /var/www/itop
```

Sous RHEL/Rocky : paquets `php-*` équivalents (`dnf`), SELinux `httpd_sys_rw_content_t` sur `conf/`, `data/`, `env-production/` et `log/`. Sous **Windows** : IIS + PHP (FastCGI) + MySQL, ou une pile WAMP, avec copie du dossier `web` dans la racine du site. **Docker** : pas d'image officielle de Combodo ; des images communautaires existent (vérifier leur maintenance).

Ouvrir `https://itop.corp.exemple.fr/setup/` : vérification des prérequis, licence, base de données, compte administrateur, puis **choix des modules** :

| Choix de l'assistant | Effet |
| --- | --- |
| CMDB : modèle de base, infrastructure réseau, virtualisation, stockage, centre de données | Classes disponibles (serveurs, VM, baies, câblage…) |
| Gestion des tickets « simple » ou **ITIL** (incidents et demandes séparés) | Processus de support |
| Gestion des changements (simple ou ITIL), problèmes, erreurs connues | Processus complémentaires |
| Gestion des services et des SLA | Catalogue, contrats, délais (TTO, TTR) |

<!-- CAPTURE: Assistant d'installation iTop, choix des modules ITIL | _assets/itop-setup-modules.png -->

### Tâche planifiée

Le *cron* traite notifications, SLA, fermetures automatiques, synchronisations. Le fichier de paramètres contient un compte administrateur : le placer hors de la racine web.

```bash
sudo mkdir -p /etc/itop
printf 'auth_user=cron-itop\nauth_pwd=MdpCronItop2026\n' | sudo tee /etc/itop/cron.params
sudo chown www-data:www-data /etc/itop/cron.params && sudo chmod 600 /etc/itop/cron.params
echo '*/5 * * * * www-data /usr/bin/php /var/www/itop/webservices/cron.php --param_file=/etc/itop/cron.params >> /var/log/itop-cron.log 2>&1' | sudo tee /etc/cron.d/itop
```

## Interface et usage

| Menu | Usage |
| --- | --- |
| Gestion des configurations | Rechercher, créer et relier des éléments (CI), **analyse d'impact** graphique, import CSV |
| Assistance / Gestion des incidents | Tickets, affectation par équipe, escalade, SLA, notifications |
| Gestion des demandes | Demandes utilisateurs liées au catalogue de services |
| Gestion des changements | Approbation, planning, impact sur les CI |
| Outils d'administration | Utilisateurs et **profils**, déclencheurs et actions (notifications), import et **sources de synchronisation**, file des courriels entrants |
| Portail utilisateur | Création et suivi des demandes par les utilisateurs finaux |

<!-- CAPTURE: Fiche d'un serveur avec l'onglet Impacts (graphe) | _assets/itop-analyse-impact.png -->
<!-- CAPTURE: Liste des incidents ouverts avec SLA | _assets/itop-incidents.png -->

- **Courriels entrants** : extension *Mail to Ticket Automation* (création et mise à jour de tickets par IMAP).
- **LDAP / Active Directory** : authentification (`authent-ldap`) et import des personnes par le **collecteur de données** (*Data Collector* LDAP).
- **Collecteurs** (vSphere, Teemip, inventaire OCS/GLPI…) : alimentent la CMDB via les *Synchro Data Sources*.
- **API REST/JSON** : `webservices/rest.php` pour l'intégration avec la supervision (création d'incidents automatiques).

```bash
curl -s -X POST https://itop.corp.exemple.fr/webservices/rest.php?version=1.3 \
  --data-urlencode 'auth_user=api-supervision' --data-urlencode 'auth_pwd=MdpApi2026' \
  --data-urlencode 'json_data={"operation":"core/get","class":"Server","key":"SELECT Server WHERE name LIKE \"srv-web%\"","output_fields":"name,status"}'
```

## Sauvegarde, mise à jour

- Sauvegarde : *Outils d'administration → Sauvegardes* (planifiables, base + configuration) ou `mysqldump itop` et le dossier `conf/`, `data/`.
- Mise à jour : sauvegarder, copier la nouvelle version par-dessus (sans écraser `conf/` et `data/`), rendre `conf/production/config-itop.php` modifiable puis relancer `/setup/` en mode **mise à jour** ; la base est migrée et les modules recompilés.

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Notifications et SLA non mis à jour | Cron absent ou fichier de paramètres invalide | `/var/log/itop-cron.log`, compte du `cron.params` |
| Graphe d'impact vide | Graphviz absent | `apt install graphviz`, chemin de `dot` dans la configuration |
| Erreur après modification du modèle | Compilation (`env-production`) incomplète | Relancer le setup, droits sur `env-production/` |
| Lenteurs sur gros volumes | MySQL 8 sans cache de requêtes, index | Dimensionner MySQL, purger l'historique |

Commandes : [[90-aide-memoire|aide-mémoire]].

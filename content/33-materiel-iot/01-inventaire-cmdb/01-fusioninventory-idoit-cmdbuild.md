---
title: FusionInventory, i-doit et CMDBuild
description: Inventaire du parc et CMDB — Agent FusionInventory (collecte automatique du matériel et des logiciels des postes et serveurs, remontée vers GLPI ou un serveur dédié, déploiement, découverte réseau et SNMP), i-doit Open (CMDB documentaire : types d'objets, relations, câblage, salles et baies, API JSON-RPC, LAMP) et CMDBuild (framework de CMDB et de gestion d'actifs configurable, workflows, GeoServer, Tomcat et PostgreSQL) ; différence entre inventaire et CMDB, et lien avec GLPI.
tags: [fusioninventory, i-doit, cmdbuild, cmdb, inventaire, parc informatique, glpi, itsm]
icon: boxes
---

Deux besoins distincts mais complémentaires :

- l'**inventaire** collecte automatiquement ce qui existe (matériel, logiciels, versions) ;
- la **CMDB** (base de données de gestion de configuration) décrit les **éléments de configuration** et surtout leurs **relations** (ce serveur héberge cette application, reliée à cette base, dans cette baie), renseignée en partie à la main.

## Agent FusionInventory

**FusionInventory** fournit un **agent** multiplateforme qui inventorie un poste ou un serveur (matériel, logiciels, numéros de série) et remonte le résultat, le plus souvent vers **[[21-outils/06-support-parc/04-glpi-installation|GLPI]]** (via son module d'inventaire natif, qui a repris le format FusionInventory). L'agent fait aussi de la **découverte réseau** et de l'interrogation **SNMP** des équipements.

```bash
# Agent sous Linux
sudo apt install fusioninventory-agent
fusioninventory-agent --server https://glpi.exemple.fr/front/inventory.php
fusioninventory-agent --local /tmp --json          # inventaire local, sans serveur (test)
```

```powershell
# Agent sous Windows (installateur MSI du projet)
msiexec /i fusioninventory-agent_x64.msi /quiet SERVER="https://glpi.exemple.fr/front/inventory.php" RUNNOW=1
```

- Exécution planifiée (service, tâche cron) ; tâches de **déploiement** de logiciels et de **découverte réseau** pilotées depuis le serveur.
- Pour un nouveau parc, l'**agent GLPI natif** (GLPI Agent, successeur direct) est souvent préféré ; il parle le même protocole.

## i-doit Open

**i-doit** (édition **Open** libre, GPL) est une **CMDB documentaire** : on y décrit chaque objet (serveur, service, logiciel, contrat, salle, baie, câble) et ses **relations**. Très utilisé pour documenter une infrastructure et préparer la gestion ITIL.

```bash
# Pile LAMP : Apache, PHP, MariaDB/MySQL ; archive i-doit Open à décompresser dans la racine web
sudo mysql -e "CREATE DATABASE idoit_data; CREATE DATABASE idoit_system;"
# Puis assistant web : http://serveur/ (configuration des bases et du compte admin)
```

- Types d'objets et attributs **personnalisables**, documentation du **câblage** et des baies, import CSV, journal des modifications.
- **API JSON-RPC** pour alimenter la CMDB depuis d'autres outils (découverte, scripts) et la relier à la supervision ou à la gestion de tickets.
- L'édition Open couvre le cœur CMDB ; les add-ons (analyses d'impact avancées, etc.) relèvent de l'édition Pro.

## CMDBuild

**CMDBuild** (GPL) est un **framework** pour construire sa propre CMDB et sa gestion d'actifs : on modélise les classes d'objets, les relations et des **workflows** (processus de changement, cycle de vie), avec un moteur de rapports et une couche cartographique (GeoServer) pour le réseau physique.

```bash
# Application Java (Tomcat) + PostgreSQL ; archive WAR + schéma de base fournis
# Variante « CMDBuild READY2USE » : modèle préconfiguré orienté ITSM
```

Puissant et très configurable, mais **plus lourd à mettre en œuvre** : réserver aux organisations qui veulent modéliser finement leurs processus.

## Choisir

| Besoin | Outil |
| --- | --- |
| Inventaire automatique des postes et serveurs | Agent FusionInventory / GLPI Agent |
| Parc + tickets + inventaire tout-en-un | [[21-outils/06-support-parc/04-glpi-installation\|GLPI]] |
| Documenter l'infrastructure et ses relations | i-doit Open |
| CMDB sur mesure avec workflows | CMDBuild |
| CMDB intégrée à la gestion de services | [[21-outils/06-support-parc/15-itop\|iTop]] |

Une CMDB n'a de valeur que si elle reste **à jour** : alimenter au maximum par l'inventaire automatique et la découverte, limiter la saisie manuelle à ce qui ne peut pas être découvert (relations métier, responsables, contrats).

Commandes : [[90-aide-memoire|aide-mémoire]].

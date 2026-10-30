---
title: OCS Inventory NG
description: OCS Inventory NG, inventaire libre de parc informatique — architecture (serveur de communication, console d'administration, base MySQL/MariaDB, agents Windows, Linux, macOS, Android), installation (paquets, Docker), sécurisation (comptes par défaut, install.php, HTTPS, mot de passe de la base), déploiement des agents, inventaire réseau (IPDiscover, SNMP), télédéploiement de paquets, plugins, articulation avec GLPI et dépannage.
tags: [ocs inventory, inventaire, agent, ipdiscover, snmp, télédéploiement, gestion de parc]
icon: package-search
---

**OCS Inventory NG** (*Open Computers and Software Inventory Next Generation*, GPL) collecte l'inventaire matériel et logiciel des ordinateurs via des **agents** et découvre les équipements du réseau. Historiquement associé à GLPI (alimentation de la CMDB), il est aujourd'hui souvent remplacé par l'inventaire natif de GLPI ([[05-glpi-inventaire-assistance|GLPI Agent]]), mais reste utilisé pour son télédéploiement et ses rapports.

## Architecture

| Composant | Rôle |
| --- | --- |
| Serveur de communication | Module Apache/Perl (`/ocsinventory`) qui reçoit les inventaires des agents |
| Console d'administration | Application PHP (`/ocsreports`) |
| Base | MySQL / MariaDB |
| Agents | Windows (service), Linux et Unix (Perl), macOS, Android |
| IPDiscover | Agents élus qui découvrent les adresses actives de leur sous-réseau |

## Installation

```bash
# Paquets du dépôt OCS (Debian/Ubuntu, RHEL) ou archive « OCSNG_UNIX_SERVER » avec setup.sh
sudo apt install ocsinventory-server ocsinventory-reports      # selon la disponibilité dans la distribution
# Docker : dépôt officiel OCSInventory-Docker-Image (serveur + base)
```

Puis `https://ocs.corp.exemple.fr/ocsreports` : assistant de base de données.

> [!WARNING]
> Après l'installation : **supprimer `install.php`**, changer le mot de passe du compte administrateur par défaut (`admin`/`admin`), changer le mot de passe de l'utilisateur de base `ocs` (et le reporter dans la configuration Apache `z-ocsinventory-server.conf` et `dbconfig.inc.php`), publier la console en **HTTPS** et la restreindre au réseau d'administration.

## Agents

```powershell
# Windows : installation silencieuse
OCS-Windows-Agent-Setup-x64.exe /S /NOSPLASH /SERVER=https://ocs.corp.exemple.fr/ocsinventory /SSL=1 /CA="C:\ProgramData\OCS\cacert.pem" /TAG="Siege" /NOW
```

```bash
# Linux : paquet ocsinventory-agent, configuration
sudo apt install ocsinventory-agent
echo 'server=https://ocs.corp.exemple.fr/ocsinventory' | sudo tee /etc/ocsinventory/ocsinventory-agent.cfg
sudo ocsinventory-agent --force
```

Déploiement par GPO, script de démarrage, [[09-pdq-deploy|PDQ Deploy]] ou [[10-intune-inscription|Intune]].

## Inventaire réseau

- **IPDiscover** : la console désigne des agents qui balaient leur sous-réseau (ARP) ; les équipements sans agent apparaissent comme « non inventoriés » et peuvent être identifiés (type, description).
- **SNMP** : scans SNMP (communauté ou SNMPv3) depuis des agents pour inventorier commutateurs, imprimantes, onduleurs.

## Télédéploiement

Paquets (exécutable, script, fichiers) créés dans la console, stockés sur un serveur de téléchargement HTTPS, puis affectés à des machines ou groupes : l'agent les télécharge (fragments) et les exécute, avec remontée de l'état. Le canal doit être en HTTPS avec certificat vérifié par l'agent.

## Intégration avec GLPI

Le plugin **OCS Inventory NG** de GLPI importe les machines d'OCS dans la CMDB (synchronisation planifiée). Pour un nouveau projet, l'inventaire natif de GLPI évite cette double infrastructure.

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Agent : « Cannot establish communication » | URL, certificat (`/CA`), pare-feu | Journal de l'agent (`%ProgramData%\OCS Inventory NG\Agent`), test de l'URL |
| Machines en double | Clonage sans réinitialisation de l'identifiant | Règles de dédoublonnage de la console, réinitialisation de l'agent |
| Console « Database connection error » | Mot de passe de la base changé sans mise à jour de la configuration | `dbconfig.inc.php` et configuration Apache |
| Télédéploiement bloqué | Certificat du serveur de paquets, fragments | HTTPS, journal de téléchargement de l'agent |

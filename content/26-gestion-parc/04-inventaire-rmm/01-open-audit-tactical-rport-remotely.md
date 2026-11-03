---
title: Open-AudIT, Tactical RMM, RPort et Remotely
description: Inventaire et gestion à distance du parc — Open-AudIT (FirstWave : découverte réseau SNMP, SSH et WMI, inventaire matériel et logiciel, rapports, édition Community), Tactical RMM (Django et Vue, agent Go, MeshCentral intégré : supervision, scripts, correctifs Windows, téléassistance ; script d'installation Debian/Ubuntu, trois sous-domaines, licence), RPort et OpenRPort (MIT : accès distant sans VPN par tunnels, commandes et scripts, rportd et client rport) et Remotely (GPL : téléassistance et scripts .NET en Docker, état du projet), avec règles de sécurité des outils RMM.
tags: [open-audit, tactical rmm, rport, openrport, remotely, rmm, inventaire, téléassistance]
icon: radar
---

Un **RMM** (*Remote Monitoring and Management*) réunit sur un parc : inventaire, alertes, exécution de scripts, correctifs et prise en main à distance. Ce sont des outils **très privilégiés** (un agent SYSTEM/root sur chaque machine) : leur compromission donne accès à tout le parc.

| Outil | Rôle | Hébergement | Licence |
| --- | --- | --- | --- |
| **Open-AudIT** | Découverte et **inventaire** réseau, rapports, changements | Linux, Windows | Community gratuite (FirstWave) ; éditions payantes |
| **Tactical RMM** | RMM complet : agent, supervision, scripts, correctifs, prise en main (MeshCentral) | Debian, Ubuntu | *Tactical RMM License* (source disponible, restrictions) |
| **RPort / OpenRPort** | Accès distant par tunnels, commandes et scripts, inventaire léger | Linux (serveur), clients multi-OS | MIT (OpenRPort, suite communautaire) |
| **Remotely** | Téléassistance et scripts à distance | Docker | GPL 3.0 — peu actif depuis 2024 |

Comparer aussi avec [[06-support-parc/03-meshcentral|MeshCentral]], [[06-support-parc/02-rustdesk|RustDesk]], [[06-support-parc/07-ocs-inventory|OCS Inventory]] et [[06-support-parc/05-glpi-inventaire-assistance|GLPI]].

## Open-AudIT

Installateurs pour Debian, Ubuntu, RHEL et Windows fournis par FirstWave ; interface `http://audit.corp.exemple.fr/open-audit` (compte initial `admin` / `password` : à changer). Déclarer des **identifiants** de découverte (communauté ou utilisateur SNMPv3, compte SSH avec sudo restreint, compte Windows pour WMI), puis une **découverte** sur un sous-réseau : Open-AudIT détecte les équipements, interroge chacun et enregistre matériel, logiciels, services, utilisateurs et cartes réseau. Les audits répétés font apparaître les **changements** (logiciel ajouté, disque remplacé). Pour les machines isolées, des scripts d'audit locaux (`audit_windows.vbs`, `audit_linux.sh`) envoient le résultat au serveur.

## Tactical RMM

Serveur Debian 13 ou Ubuntu 26.04 dédié (versions acceptées par le script) avec **trois noms DNS** (API, interface, MeshCentral) et un certificat (Let's Encrypt par DNS ou certificat interne) :

```bash
# en tant qu'utilisateur non root ayant sudo
wget https://raw.githubusercontent.com/amidaware/tacticalrmm/master/install.sh
chmod +x install.sh && ./install.sh
# demande : api.rmm.corp.exemple.fr, rmm.corp.exemple.fr, mesh.rmm.corp.exemple.fr, adresse e-mail, certificat
```

Fonctions : agents Windows, Linux et macOS (installateur généré par client et site), **contrôles** (disque, CPU, services, journaux d'événements, scripts) avec alertes, bibliothèque de **scripts** PowerShell/Python/Bash planifiables, gestion des **correctifs Windows**, logiciels via Chocolatey, prise en main et terminal distant par MeshCentral intégré. Activer la double authentification pour tous les comptes et limiter l'accès à l'interface (VPN ou liste d'adresses). La licence interdit notamment de revendre le logiciel comme service : la lire avant un usage par un prestataire.

## RPort / OpenRPort

RPort a été repris par RealVNC (versions 1.x sous licence commerciale) ; la communauté poursuit la branche open source sous le nom **OpenRPort** (MIT). Le serveur `rportd` (Linux) reçoit les connexions **sortantes** des clients `rport` : on accède ensuite à SSH, RDP ou une interface web d'une machine sans VPN ni port ouvert chez elle, par un **tunnel** créé à la demande et restreint à l'adresse de l'administrateur. Il permet aussi d'exécuter commandes et scripts sur des groupes de machines et collecte un inventaire de base. Configuration du serveur dans `/etc/rport/rportd.conf` (service `rportd`), du client dans `/etc/rport/rport.conf` (Windows : dossier d'installation). Activer la double authentification et l'authentification par clé des clients.

## Remotely

Téléassistance et scripts .NET (Blazor, SignalR), déployée en Docker :

```bash
mkdir -p /var/www/remotely
wget -q https://raw.githubusercontent.com/immense/Remotely/master/docker-compose/docker-compose.yml
docker compose up -d
```

Le serveur doit être placé derrière un reverse proxy **HTTPS** gérant les WebSockets ; le premier compte créé devient administrateur (désactiver ensuite l'inscription libre). Le projet n'évolue presque plus depuis 2024 : pour une nouvelle installation, préférer RustDesk ou MeshCentral.

## Sécurité des outils RMM

- Interface d'administration jamais exposée sans MFA ; idéalement accessible uniquement par VPN.
- Comptes nominatifs, rôles limités (un technicien ne doit pas pouvoir lancer un script sur tout le parc).
- Journaliser et superviser les actions (scripts lancés, sessions ouvertes) ; un RMM est une cible privilégiée des rançongiciels.
- Sauvegarder la base et les clés du serveur.

Commandes : [[90-aide-memoire|aide-mémoire]].

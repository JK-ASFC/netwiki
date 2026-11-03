---
title: FOG, opsi et WAPT — déploiement d'images et de logiciels
description: Équiper et maintenir un parc de postes — FOG Project (GPL : capture et déploiement d'images disque par PXE, multicast, inventaire, FOG Client pour renommage, jonction au domaine et snapins ; installfog.sh, DHCP options 66 et 67, iPXE), opsi (AGPL, uib : serveur Linux de déploiement de logiciels, installation de Windows et inventaire ; Docker uibmz/opsi-server, opsi-script, opsi-makepackage, opsi-package-manager, configed) et WAPT (Tranquil IT : paquets Python signés, wapt-get, console, dépôt, édition Community), comparaison avec PDQ Deploy, Intune et GPO.
tags: [fog, opsi, wapt, déploiement, pxe, image disque, paquets, windows]
icon: hard-drive-download
---

| Outil | Rôle principal | Serveur | Clients | Licence |
| --- | --- | --- | --- | --- |
| **FOG Project** | Images disque (**masterisation**) par le réseau | Linux | Windows, Linux | GPL 3.0 |
| **opsi** | Déploiement et mise à jour de **logiciels**, installation de Windows, inventaire | Linux (Docker possible) | Windows, Linux, macOS | AGPL 3.0 (extensions payantes) |
| **WAPT** | Paquets logiciels signés, mises à jour, conformité | Linux (Debian, RHEL) | Windows, Linux, macOS | Community gratuite ; Enterprise payante |

## FOG Project

Installation sur un serveur Debian ou Ubuntu dédié (adresse IP fixe) :

```bash
sudo -i
git clone https://github.com/fogproject/fogproject.git fogproject-stable
cd fogproject-stable/bin && ./installfog.sh
```

L'installateur demande s'il doit fournir le **DHCP**. S'il existe déjà un DHCP ([[02-kea/01-presentation-installation|Kea]], Windows), y déclarer l'amorçage PXE :

| Option | Valeur |
| --- | --- |
| 66 (next-server) | adresse du serveur FOG |
| 67 (nom du fichier) | `ipxe.efi` (UEFI) ou `undionly.kpxe` (BIOS) |

Interface : `http://fog.corp.exemple.fr/fog/management` (compte initial `fog` / `password` : à changer). Cycle de travail :

1. Préparer un poste modèle (Windows généralisé avec `sysprep /generalize /oobe /shutdown`).
2. L'**enregistrer** depuis le menu PXE (inventaire rapide), lui associer une image et lancer une tâche **Capture**.
3. **Déployer** l'image sur un poste ou un groupe (unicast ou **multicast** pour une salle entière).

Le **FOG Client** (service Windows/Linux) renomme les postes, les joint au domaine Active Directory, installe des imprimantes et des **snapins** (scripts ou installateurs).

## opsi

Serveur conteneurisé (fichier `docker-compose.yml` du dépôt opsi-org/opsi-docker : image `uibmz/opsi-server`, MariaDB, Redis, Grafana ; ports **4447** et 69/udp pour le TFTP) ou paquets pour Debian, Ubuntu, RHEL, SUSE. Interface d'administration `https://opsi.corp.exemple.fr:4447/admin` et console **configed** (Java, Windows, Linux, macOS).

```bash
opsi-deploy-client-agent -u CORP\\admin-deploi pc-compta-01.corp.exemple.fr   # installer l'agent depuis le serveur
opsi-makepackage                       # dans le dossier du paquet (OPSI/control, CLIENT_DATA/setup.opsiscript)
opsi-package-manager -i firefox_140.0-1.opsi
opsi-package-manager -l                # paquets installés sur le dépôt
```

Un paquet contient un script **opsi-script** :

```text
[Actions]
Winbatch_install
[Winbatch_install]
msiexec /i "%ScriptPath%\Firefox Setup 140.0.msi" /qn /norestart
```

On fixe ensuite dans configed l'action `setup` pour un poste ou un groupe ; l'agent l'exécute au prochain démarrage ou à la demande. opsi gère aussi l'installation réseau de Windows (paquets netboot) et l'inventaire matériel et logiciel.

## WAPT

Solution française (Tranquil IT) : serveur sur Debian, Ubuntu ou RHEL, console **waptconsole** sous Windows, agent sur chaque poste. Les paquets `.wapt` sont des archives signées contenant un script Python :

```python
# setup.py d'un paquet WAPT
from setuphelpers import *

def install():
    install_msi_if_needed("7z-x64.msi")

def uninstall():
    pass
```

```powershell
wapt-get update                 # rafraîchir la liste des paquets
wapt-get search firefox
wapt-get install tis-firefox    # paquets publiés par Tranquil IT : préfixe tis-
wapt-get upgrade                # appliquer les mises à jour en attente
wapt-get list ; wapt-get status
```

Le dépôt public de Tranquil IT fournit des centaines de paquets que l'on **importe** dans son dépôt interne et que l'on re-signe avec sa propre clé. L'édition Community couvre le déploiement et les mises à jour ; l'édition Enterprise ajoute notamment les unités d'organisation AD, les rapports et l'installation de Windows.

## Choisir

- **Masteriser une salle** ou réinstaller des postes rapidement : FOG (ou [[07-disques-recuperation/02-clonezilla|Clonezilla]] pour quelques machines).
- **Maintenir les logiciels à jour** sur un parc Windows : WAPT, opsi, [[06-support-parc/09-pdq-deploy|PDQ Deploy]] ou [[06-support-parc/11-intune-strategies-applications|Intune]].
- **Mises à jour Windows** : [[04-wsus/01-presentation-installation|WSUS]] en complément.

Commandes : [[90-aide-memoire|aide-mémoire]].

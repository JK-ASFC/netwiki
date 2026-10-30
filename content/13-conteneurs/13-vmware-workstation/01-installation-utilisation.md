---
title: Installation, réseaux et laboratoires
description: VMware Workstation Pro (Windows, Linux) et Fusion (macOS) — gratuité pour tous les usages depuis fin 2024 et téléchargement via le portail Broadcom, installation et déploiement silencieux, création de VM (UEFI, vTPM et chiffrement pour Windows 11), éditeur de réseaux virtuels (VMnet0 pont, VMnet1 privé hôte, VMnet8 NAT, réseaux personnalisés), laboratoires réseau (EVE-NG, GNS3, appliances OVA), instantanés et clones liés, vmrun, connexion à ESXi/vCenter, cohabitation avec Hyper-V et dépannage.
tags: [vmware workstation, fusion, virtualisation, laboratoire, vmnet, eve-ng, gns3, vmrun]
icon: monitor
---

**VMware Workstation Pro** (Windows, Linux) et **VMware Fusion Pro** (macOS) sont les hyperviseurs de poste de travail de VMware (Broadcom). Depuis **novembre 2024**, ils sont **gratuits pour tous les usages** (personnel, éducatif et **commercial**), sans support ; Workstation Player a disparu au profit de Workstation Pro. Ils sont appréciés pour leur compatibilité avec vSphere (formats, appliances) et leurs réseaux virtuels riches, parfaits pour des **laboratoires réseau**.

## Installation

- Téléchargement depuis le **portail de support Broadcom** (compte gratuit requis), section *VMware Workstation Pro* / *Fusion*.
- Windows : `VMware-workstation-full-17.x.exe /s /v"/qn EULAS_AGREED=1 AUTOSOFTWAREUPDATE=0 DATACOLLECTION=0"` (installation silencieuse).
- Linux : `sudo sh VMware-Workstation-Full-17.x.x86_64.bundle` ; les modules noyau `vmmon`/`vmnet` sont compilés pour le noyau courant (à signer avec Secure Boot).

## Créer une VM

| Réglage | Recommandation |
| --- | --- |
| Firmware | **UEFI**, démarrage sécurisé |
| Windows 11 | **vTPM** (nécessite le **chiffrement** de la VM, partiel ou complet) |
| Disque | NVMe ou SCSI (LSI/pvscsi), disque unique ou fractionné |
| VMware Tools | Installer dans l'invité (pilotes, presse-papiers, dossiers partagés) ; `open-vm-tools` sous Linux |
| Virtualisation imbriquée | *Processeurs → Virtualiser Intel VT-x/EPT ou AMD-V/RVI* (ESXi, Hyper-V ou EVE-NG dans la VM) |

## Réseaux virtuels

*Edit → Virtual Network Editor* (droits administrateur) :

| Réseau | Type par défaut | Usage |
| --- | --- | --- |
| **VMnet0** | Pont (*bridged*) | VM sur le réseau physique |
| **VMnet1** | Privé hôte (*host-only*) | VM ↔ hôte |
| **VMnet8** | **NAT** (DHCP intégré) | Accès Internet par l'hôte |
| VMnet2 à VMnet19 | Personnalisés (privé hôte sans DHCP, ou isolés) | **Segments de laboratoire** : LAN, DMZ, transit entre routeurs |
| *LAN Segments* | Commutateurs isolés sans l'hôte | Liens point à point entre VM |

Le NAT de VMnet8 permet aussi des redirections de ports vers les VM (*NAT Settings → Port Forwarding*).

## Laboratoires réseau

| Plateforme | Usage |
| --- | --- |
| **EVE-NG** (Community/Pro) | Appliance (OVA) qui émule routeurs, commutateurs et pare-feu (Cisco IOL/IOSv, Juniper vMX/vSRX, Fortinet, Palo Alto, Arista vEOS…) : topologies dessinées dans un navigateur |
| **GNS3** | Interface graphique + **GNS3 VM** dans Workstation |
| Containerlab | Topologies d'équipements conteneurisés (Linux, souvent dans une VM) |
| Appliances OVA | Pare-feu (OPNsense, FortiGate VM d'évaluation), contrôleurs, outils de supervision |

Prévoir beaucoup de mémoire (32 Go et plus pour des topologies réalistes) et activer la virtualisation imbriquée sur la VM EVE-NG/GNS3. Les images d'équipements des constructeurs sont soumises à leurs **licences**.

## Instantanés, clones, ligne de commande

- **Instantanés** et gestionnaire d'instantanés (arborescence) ; **clones liés** (partagent le disque parent, création instantanée) pour multiplier les VM de labo.
- Connexion à **ESXi / vCenter** depuis Workstation (*File → Connect to Server*) pour gérer des VM distantes ; export/import **OVF/OVA**.

```text vmrun (Windows : "C:\Program Files (x86)\VMware\VMware Workstation\vmrun.exe")
vmrun -T ws list
vmrun -T ws start "D:\VMs\lab-fw01\lab-fw01.vmx" nogui
vmrun -T ws snapshot "D:\VMs\lab-fw01\lab-fw01.vmx" "Configuration initiale"
vmrun -T ws revertToSnapshot "D:\VMs\lab-fw01\lab-fw01.vmx" "Configuration initiale"
vmrun -T ws stop "D:\VMs\lab-fw01\lab-fw01.vmx" soft
```

Une **API REST** locale (`vmrest`) permet aussi l'automatisation (et Packer/Vagrant via leurs fournisseurs VMware).

## Cohabitation avec Hyper-V

Depuis la version 15.5, Workstation fonctionne avec Hyper-V, WSL 2 et VBS actifs en utilisant l'API *Windows Hypervisor Platform* (performances un peu inférieures, virtualisation imbriquée limitée). Pour EVE-NG/ESXi imbriqués, Hyper-V et VBS doivent souvent être désactivés — arbitrage à faire avec la politique de sécurité du poste.

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `This host supports Intel VT-x, but Intel VT-x is disabled` | Virtualisation désactivée dans l'UEFI | Activer VT-x/AMD-V |
| Virtualisation imbriquée refusée | Hyper-V/VBS actifs | Désactiver (avec accord) ou utiliser Hyper-V |
| Pas d'accès Internet en NAT | Services *VMware NAT Service* / *DHCP Service* arrêtés | Redémarrer les services, *Restore Defaults* dans l'éditeur de réseaux |
| Linux : modules `vmmon` non chargés | Noyau mis à jour, Secure Boot | Recompiler (`vmware-modconfig --console --install-all`), signer les modules |
| VM chiffrée inaccessible | Mot de passe de chiffrement perdu | Conserver le mot de passe dans le gestionnaire de mots de passe ; aucune récupération possible |

Pour des laboratoires plus importants ou partagés par l'équipe, un serveur [[11-proxmox-ve/01-presentation-installation|Proxmox VE]] est plus adapté qu'un poste de travail.

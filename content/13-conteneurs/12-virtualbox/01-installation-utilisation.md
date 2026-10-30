---
title: Installation, réseaux et utilisation
description: Oracle VirtualBox, hyperviseur de poste de travail (Windows, Linux, macOS Intel et Apple Silicon) — licence de la base GPL et du pack d'extension (PUEL, usage commercial payant), installation, création de VM (EFI, TPM, Additions invité), modes réseau (NAT, réseau NAT, accès par pont, réseau privé hôte, réseau interne) pour les laboratoires, instantanés et clones, VBoxManage, import/export OVA, Vagrant, cohabitation avec Hyper-V et dépannage.
tags: [virtualbox, virtualisation, laboratoire, vboxmanage, réseau, vagrant, oracle]
icon: box
---

**VirtualBox** (Oracle) est un hyperviseur de **poste de travail** gratuit et multiplateforme : idéal pour monter un **laboratoire** (serveurs Linux, contrôleur de domaine de test, pare-feu virtuel, routeurs virtuels) sur un portable.

> [!IMPORTANT]
> **Licences** : le cœur de VirtualBox est sous **GPLv3** (usage libre, y compris en entreprise). Le **pack d'extension** (*Extension Pack* : USB 3 de l'hôte, chiffrement de disque, démarrage PXE Intel, webcam…) est sous licence **PUEL** : gratuit pour un usage personnel ou d'évaluation, **payant pour un usage commercial** (Oracle effectue des audits). N'installez le pack d'extension sur des postes d'entreprise que si une licence est prévue.

## Installation

```powershell
winget install Oracle.VirtualBox
```

```bash
sudo apt install virtualbox          # paquet Debian/Ubuntu, ou paquet Oracle (dépôt download.virtualbox.org) plus récent
# Le module noyau vboxdrv doit être compilé pour le noyau courant ; avec Secure Boot, signer les modules (MOK)
```

macOS : paquet `.dmg` (Intel ; version pour Apple Silicon qui n'exécute que des invités **ARM64**).

## Créer une VM

| Réglage | Recommandation |
| --- | --- |
| Système | **EFI** activé pour les systèmes modernes ; TPM 2.0 et Secure Boot pour Windows 11 |
| Processeurs / mémoire | Laisser assez de ressources à l'hôte |
| Disque | VDI dynamique ; contrôleur SATA ou NVMe |
| **Additions invité** | Installer dans la VM (*Périphériques → Insérer l'image CD des Additions invité*) : pilotes graphiques, presse-papiers partagé, dossiers partagés, synchronisation de l'heure |
| Virtualisation imbriquée | *Système → Processeur → Activer VT-x/AMD-V imbriqué* (hyperviseur dans la VM) |

## Réseaux virtuels

| Mode | Communication | Usage en laboratoire |
| --- | --- | --- |
| **NAT** (défaut) | VM → extérieur via l'hôte ; pas de connexion entrante (sauf redirection de ports) ; chaque VM isolée des autres | Accès Internet simple |
| **Réseau NAT** | Plusieurs VM dans un même réseau privé avec accès sortant | Petit labo avec Internet |
| **Accès par pont** (*bridged*) | VM directement sur le réseau physique (adresse du LAN) | Équipement « réel » sur le réseau (à éviter sur un réseau d'entreprise sans accord) |
| **Réseau privé hôte** (*host-only*) | VM ↔ hôte uniquement | Administration des VM depuis l'hôte (SSH, web) |
| **Réseau interne** | VM ↔ VM d'un même réseau nommé, sans l'hôte | Segments isolés : LAN, DMZ, réseau de gestion d'un labo |

Exemple de laboratoire : un pare-feu virtuel (pfSense/OPNsense) avec une carte en NAT (WAN) et deux cartes en réseau interne (`lab-lan`, `lab-dmz`), des serveurs dans ces réseaux, et une carte *host-only* pour l'administration.

## VBoxManage

```bash
VBoxManage list vms
VBoxManage createvm --name lab-dc01 --ostype Windows2022_64 --register
VBoxManage modifyvm lab-dc01 --memory 4096 --cpus 2 --firmware efi --nic1 intnet --intnet1 lab-lan
VBoxManage createmedium disk --filename ~/VMs/lab-dc01.vdi --size 61440
VBoxManage storagectl lab-dc01 --name SATA --add sata
VBoxManage storageattach lab-dc01 --storagectl SATA --port 0 --type hdd --medium ~/VMs/lab-dc01.vdi
VBoxManage startvm lab-dc01 --type headless
VBoxManage snapshot lab-dc01 take "Avant promotion AD"
VBoxManage controlvm lab-dc01 acpipowerbutton
VBoxManage export lab-dc01 -o lab-dc01.ova          # format OVA, importable dans d'autres hyperviseurs
```

**Vagrant** (HashiCorp) décrit des labos reproductibles (`Vagrantfile`) avec VirtualBox comme fournisseur : `vagrant up` crée et configure les VM (avec Ansible en provisionneur).

## Cohabitation avec Hyper-V (Windows)

Si Hyper-V, WSL 2, *Sandbox Windows* ou la sécurité basée sur la virtualisation (VBS, intégrité de la mémoire) sont actifs, VirtualBox utilise l'API de Windows (*Windows Hypervisor Platform*) : il fonctionne mais plus **lentement** (icône de tortue verte dans la barre d'état). Désactiver ces fonctions améliore les performances mais réduit la sécurité du poste : sur un poste d'entreprise, préférez conserver VBS et, si les performances sont insuffisantes, utiliser [[09-hyper-v/01-presentation-installation|Hyper-V]] directement.

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `VT-x is not available` / `VERR_VMX_NO_VMX` | Virtualisation désactivée dans le BIOS/UEFI ou occupée par un autre hyperviseur | Activer VT-x/AMD-V ; vérifier Hyper-V/VBS |
| Linux : `Kernel driver not installed (rc=-1908)` | Module `vboxdrv` absent ou non signé (Secure Boot) | `sudo /sbin/vboxconfig`, signer le module ou désactiver Secure Boot |
| VM en pont sans réseau | Wi-Fi qui refuse plusieurs adresses MAC, filtrage 802.1X | NAT/réseau NAT, ou pont sur une interface filaire |
| Écran limité en résolution | Additions invité absentes, contrôleur graphique | Installer les Additions, contrôleur VMSVGA |
| VM très lente sous Windows | Mode Hyper-V (tortue) | Voir la cohabitation ci-dessus |

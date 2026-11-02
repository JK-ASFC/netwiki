---
title: Présentation, installation et premières VM
description: UTM — virtualisation et émulation pour macOS basées sur QEMU et Apple Virtualization.framework, Mac Apple Silicon et Intel, installation (site officiel, Homebrew, Mac App Store), galerie de machines prêtes, Windows 11 ARM, Linux ARM64 et x86_64 émulé, macOS invité, réseau partagé ou ponté, dossiers partagés, limites et alternatives.
tags: [utm, macos, apple silicon, qemu, virtualisation, windows 11 arm, émulation]
icon: info
---

**UTM** (licence Apache 2.0) est l'application de virtualisation libre de référence sur **macOS**. Elle propose deux moteurs :

| Moteur | Principe | Usage |
| --- | --- | --- |
| **Virtualiser** (QEMU + HVF) | Invité de la **même architecture** que le Mac, vitesse quasi native | Mac M1–M4 : Windows 11 ARM, Linux ARM64 ; Mac Intel : x86_64 |
| **Émuler** (QEMU TCG) | Invité d'une **autre architecture** (x86_64 sur Apple Silicon, PowerPC, SPARC, RISC-V…) | Ancien Windows x86, routeurs virtuels, tests — lent |
| **Apple Virtualization** | Framework natif d'Apple | **macOS invité** (Apple Silicon), Linux ARM64 avec Rosetta pour les binaires x86_64 |

Utile pour un administrateur sur Mac : poste Windows de test, maquette Linux, VM d'outils (Wireshark, Ansible), ou macOS jetable pour valider un déploiement. Pour de la virtualisation serveur, voir [[14-kvm-qemu-libvirt/01-presentation-installation|KVM]] ou [[11-proxmox-ve/01-presentation-installation|Proxmox VE]].

## Installation

| Source | Commande ou lien | Remarque |
| --- | --- | --- |
| Site officiel / GitHub | `mac.getutm.app`, fichier `UTM.dmg` | Gratuit, toutes les fonctions |
| Homebrew | `brew install --cask utm` | Mises à jour avec `brew upgrade --cask utm` |
| Mac App Store | Version payante identique | Finance le projet ; quelques restrictions du bac à sable Apple |

Prérequis : macOS 11 ou plus récent (macOS 13+ pour Apple Virtualization avec Linux et Rosetta, macOS 12+ pour macOS invité).

## Créer une machine

1. **+** → *Virtualiser* (même architecture) ou *Émuler* (autre architecture).
2. Système : Windows, Linux, macOS ou *Autre*.
3. **Windows 11 ARM** : fournir l'ISO ARM64 (téléchargeable chez Microsoft) ; cocher *Installer les pilotes et SPICE tools* ; 4 cœurs, 8 Go, 64 Go de disque. TPM et Secure Boot sont émulés.
4. **Linux** : ISO ARM64 (Debian, Ubuntu Server, Fedora, Rocky…) ; option *Apple Virtualization* pour Rosetta et de meilleures performances graphiques sous macOS 13+.
5. **macOS invité** : *Virtualiser → macOS 12+* ; UTM télécharge l'image de restauration (IPSW) d'Apple.

La **galerie** (`mac.getutm.app/gallery`) fournit des machines préconfigurées (Debian, Ubuntu, ReactOS, Windows XP pour l'émulation…) à ouvrir en un clic.

## Réseau

| Mode | Comportement |
| --- | --- |
| **Réseau partagé** (défaut) | NAT par le Mac ; la VM sort sur Internet, accès entrant par redirection de ports |
| **Réseau ponté** | La VM est sur le réseau local (adresse du DHCP de l'entreprise), choix de l'interface Wi-Fi/Ethernet |
| Hôte uniquement | Communication Mac ↔ VM seulement (laboratoire isolé) |
| Émulé (VLAN QEMU) | Redirections de ports explicites (*Port Forward*) |

## Partage et intégration

- **Dossier partagé** : *VirtFS* (Linux : `mount -t 9p -o trans=virtio share /mnt/share`) ou *SPICE WebDAV* (Windows, avec les SPICE Guest Tools).
- **Presse-papiers** et redimensionnement dynamique de l'écran : SPICE Guest Tools (Windows) ou `spice-vdagent` (Linux).
- Rosetta (Apple Virtualization, Linux ARM64) : exécuter des binaires x86_64 dans la VM.

## Limites

- Pas de virtualisation x86 rapide sur Apple Silicon : Windows x86/x64 en **émulation** est très lent ; Windows 11 ARM exécute lui-même les applications x64 par émulation intégrée.
- Pas de passthrough PCI ni de GPU dédié ; accélération 3D limitée (VirGL sous Linux).
- Alternatives : Parallels Desktop et VMware Fusion (propriétaires), [[12-virtualbox/01-installation-utilisation|VirtualBox]] (prise en charge Apple Silicon récente).

Suite : [[03-interface-graphique|interface graphique]] et [[90-aide-memoire|utmctl]].

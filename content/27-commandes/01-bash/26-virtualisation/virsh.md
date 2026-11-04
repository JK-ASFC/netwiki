---
title: "virsh"
description: "Bash — virsh (Virtualisation / KVM) : Console d'administration libvirt (KVM/QEMU) : gère les machines virtuelles, réseaux, stockage et instantanés en ligne de commande."
tags: [bash, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / KVM |
| **Commande type** | `virsh list --all` |

## Rôle

Console d'administration libvirt (KVM/QEMU) : gère les machines virtuelles, réseaux, stockage et instantanés en ligne de commande.

## En détail

La télécommande de libvirt (KVM/QEMU) : lister, démarrer, arrêter, éditer et sauvegarder des VM. shutdown demande gentiment (ACPI), destroy coupe le courant. Sans argument, virsh ouvre un shell interactif.

## Options

| Option | Rôle |
| --- | --- |
| `list` | liste les domaines (VM) actifs |
| ⚠️ `--all` | avec list : inclut aussi les VM éteintes |
| `start` | démarre une VM |
| ⚠️ `shutdown` | arrêt propre via ACPI |
| ⚠️ `destroy` | arrêt forcé, coupe l'alimentation (risque de corruption) |
| `reboot` | redémarre proprement |
| `suspend` | met en pause (gèle en RAM) |
| `resume` | reprend une VM suspendue |
| ⚠️ `undefine` | supprime la définition (config) de la VM |
| `dominfo` | infos d'une VM (état, RAM, vCPU) |
| `domstate` | état courant d'une VM |
| `console` | ouvre la console série (quitter : Ctrl+]) |
| `edit` | édite le XML de définition |
| `dumpxml` | exporte la configuration XML |
| `autostart` | démarrage automatique au boot de l'hôte |
| `setmem` | ajuste la mémoire à chaud |
| `setvcpus` | ajuste le nombre de vCPU |
| `snapshot-create-as` | crée un instantané |
| `snapshot-list` | liste les instantanés |
| `net-list` | liste les réseaux virtuels |
| `pool-list` | liste les pools de stockage |

> [!WARNING]
> Options à manier avec précaution : `--all`, `shutdown`, `destroy`, `undefine`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Lister toutes les VM**

```bash
virsh list --all
```

**Démarrer**

```bash
sudo virsh start debian12
```

**Arrêt propre**

```bash
sudo virsh shutdown debian12
```

**Console**

```bash
sudo virsh console debian12
```

**Auto-démarrage**

```bash
sudo virsh autostart debian12
```

**Éditer le XML**

```bash
sudo virsh edit debian12
```

*Mots-clés : virsh libvirt kvm qemu vm machine virtuelle domaine gérer virsh*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

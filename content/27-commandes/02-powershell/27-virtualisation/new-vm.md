---
title: "New-VM"
description: "PowerShell — New-VM (Virtualisation / Hyper-V) : Crée une nouvelle machine virtuelle Hyper-V."
tags: [powershell, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Hyper-V |
| **Commande type** | `New-VM -Name ‹nom› -MemoryStartupBytes 2GB` |

## Rôle

Crée une nouvelle machine virtuelle Hyper-V.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom de la VM |
| `-MemoryStartupBytes ‹2GB›` | mémoire de démarrage |
| `-Generation ‹2›` | génération (1 = BIOS, 2 = UEFI) |
| `-NewVHDPath ‹chemin.vhdx›` | crée un disque virtuel |
| `-NewVHDSizeBytes ‹40GB›` | taille du nouveau disque |
| `-VHDPath ‹chemin.vhdx›` | réutilise un VHD existant |
| `-SwitchName ‹commutateur›` | carte réseau virtuelle |
| `-BootDevice ‹VHD/CD/NetworkAdapter›` | périphérique de démarrage |

## Exemples

**VM génération 2**

```powershell
New-VM -Name SRV01 -MemoryStartupBytes 4GB -Generation 2 -NewVHDPath C:\VM\srv01.vhdx -NewVHDSizeBytes 60GB
```

**Avec réseau**

```powershell
New-VM -Name WEB01 -MemoryStartupBytes 2GB -SwitchName "vSwitch externe"
```

**Depuis un VHD existant**

```powershell
New-VM -Name CLONE -VHDPath C:\VM\base.vhdx -Generation 2
```

*Mots-clés : hyper-v hyperv vm machine virtuelle créer new-vm génération vhd switch windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

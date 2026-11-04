---
title: "Set-VM"
description: "PowerShell — Set-VM (Virtualisation / Configuration) : Modifie la configuration d'une VM (mémoire, vCPU, démarrage automatique)."
tags: [powershell, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Configuration |
| **Commande type** | `Set-VM -Name ‹nom› -ProcessorCount 4` |

## Rôle

Modifie la configuration d'une VM (mémoire, vCPU, démarrage automatique).

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom de la VM |
| `-ProcessorCount ‹4›` | nombre de vCPU |
| `-MemoryStartupBytes ‹4GB›` | mémoire de démarrage |
| `-DynamicMemory` | active la mémoire dynamique |
| `-StaticMemory` | mémoire fixe |
| `-AutomaticStartAction ‹Start/Nothing›` | action au démarrage de l'hôte |
| `-AutomaticStopAction ‹Save/ShutDown›` | action à l'arrêt de l'hôte |

## Exemples

**4 vCPU**

```powershell
Set-VM -Name SRV01 -ProcessorCount 4
```

**Mémoire dynamique**

```powershell
Set-VM -Name SRV01 -DynamicMemory -MemoryStartupBytes 2GB
```

**Démarrage auto**

```powershell
Set-VM -Name SRV01 -AutomaticStartAction Start
```

*Mots-clés : hyper-v hyperv vm set-vm configurer mémoire processeur cpu dynamique windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

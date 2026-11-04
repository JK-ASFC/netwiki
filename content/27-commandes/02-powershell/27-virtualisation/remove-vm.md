---
title: "Remove-VM"
description: "PowerShell — Remove-VM (Virtualisation / Suppression) : Supprime une VM Hyper-V (sa configuration ; les fichiers VHD restent sur le disque)."
tags: [powershell, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Suppression |
| **Commande type** | `Remove-VM -Name ‹nom› -Force` |

## Rôle

Supprime une VM Hyper-V (sa configuration ; les fichiers VHD restent sur le disque).

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom de la VM |
| ⚠️ `-Force` | supprime sans confirmation |
| `(arrêter d'abord)` | Stop-VM -Name ‹nom› |
| `(supprimer le VHD)` | Remove-Item ‹chemin.vhdx› (manuel) |

> [!WARNING]
> Options à manier avec précaution : `-Force`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Supprimer**

```powershell
Remove-VM -Name VIEUX -Force
```

**Arrêter puis supprimer**

```powershell
Stop-VM -Name VIEUX -TurnOff -Force ; Remove-VM -Name VIEUX -Force
```

**Lister avant**

```powershell
Get-VM
```

*Mots-clés : hyper-v hyperv vm remove-vm supprimer détruire machine virtuelle windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

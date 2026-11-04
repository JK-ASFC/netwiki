---
title: "Get-BitLockerVolume"
description: "PowerShell — Get-BitLockerVolume (Durcissement / Sécurité) : État du chiffrement BitLocker des volumes."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Durcissement / Sécurité |
| **Commande type** | `Get-BitLockerVolume` |

## Rôle

État du chiffrement BitLocker des volumes.

## Options

| Option | Rôle |
| --- | --- |
| `(seul)` | état de tous |
| `-MountPoint ‹lettre›` | un volume |
| `Enable-BitLocker` | active |
| `ProtectionStatus` | statut |

## Exemples

**État BitLocker**

```powershell
Get-BitLockerVolume | Select MountPoint,ProtectionStatus
```

*Mots-clés : bitlocker chiffrement disque sécurité volume get-bitlockervolume*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

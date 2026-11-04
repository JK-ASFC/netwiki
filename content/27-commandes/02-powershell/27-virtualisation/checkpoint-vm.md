---
title: "Checkpoint-VM"
description: "PowerShell — Checkpoint-VM (Virtualisation / Snapshots) : Crée un point de contrôle (snapshot) d'une VM Hyper-V."
tags: [powershell, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Snapshots |
| **Commande type** | `Checkpoint-VM -Name ‹nom› -SnapshotName ‹étiquette›` |

## Rôle

Crée un point de contrôle (snapshot) d'une VM Hyper-V.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom de la VM |
| `-SnapshotName ‹étiquette›` | nom du point de contrôle |
| `(Get-VMSnapshot -VMName ‹nom›)` | liste les points |
| `(Restore-VMSnapshot -Name ‹étiquette›)` | restaure un point |
| `(Remove-VMSnapshot)` | supprime un point |

## Exemples

**Créer**

```powershell
Checkpoint-VM -Name SRV01 -SnapshotName avant-maj
```

**Lister**

```powershell
Get-VMSnapshot -VMName SRV01
```

**Restaurer**

```powershell
Restore-VMSnapshot -VMName SRV01 -Name avant-maj
```

*Mots-clés : hyper-v hyperv vm checkpoint snapshot point contrôle instantané restaurer windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

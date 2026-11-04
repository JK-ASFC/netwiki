---
title: "Get-PhysicalDisk"
description: "PowerShell — Get-PhysicalDisk (Disques / Matériel) : Liste les disques physiques (santé, type, taille)."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Disques / Matériel |
| **Commande type** | `Get-PhysicalDisk` |

## Rôle

Liste les disques physiques (santé, type, taille).

## Options

| Option | Rôle |
| --- | --- |
| `-FriendlyName ‹nom›` | par nom |
| `.HealthStatus` | état de santé |
| `.MediaType` | HDD / SSD |
| `(sans arg)` | tous les disques |

## Exemples

**Tous**

```powershell
Get-PhysicalDisk
```

**Santé et type**

```powershell
Get-PhysicalDisk | Select FriendlyName,HealthStatus,MediaType
```

**Un disque**

```powershell
Get-PhysicalDisk -FriendlyName "*Samsung*"
```

*Mots-clés : disque physique matériel santé ssd hdd get-physicaldisk*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

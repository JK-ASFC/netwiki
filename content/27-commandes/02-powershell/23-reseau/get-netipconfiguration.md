---
title: "Get-NetIPConfiguration"
description: "PowerShell — Get-NetIPConfiguration (Dépannage réseau) : IP, passerelle, DNS par interface."
tags: [powershell, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `Get-NetIPConfiguration` |

## Rôle

IP, passerelle, DNS par interface.

## Options

| Option | Rôle |
| --- | --- |
| `-InterfaceAlias ‹interface›` | une interface |
| `-Detailed` | étendu |
| `Get-NetIPAddress` | adresses seules |
| `Get-NetRoute` | routes |

## Exemples

**Config complète**

```powershell
Get-NetIPConfiguration
```

**Routes**

```powershell
Get-NetRoute
```

*Mots-clés : ip adresse passerelle dns interface configuration ipconfig get-netipconfiguration*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

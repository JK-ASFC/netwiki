---
title: "Get-WindowsFeature"
description: "PowerShell — Get-WindowsFeature (Rôles & fonctionnalités) : Liste les rôles et fonctionnalités et leur état (installé ou non)."
tags: [powershell, commande, windows-server]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Windows Server |
| **Contexte** | Rôles & fonctionnalités |
| **Commande type** | `Get-WindowsFeature` |

## Rôle

Liste les rôles et fonctionnalités et leur état (installé ou non).

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹motif›` | filtre par nom (jokers) |
| `(Where Installed)` | ne montre que ce qui est installé |

## Exemples

**Tout**

```powershell
Get-WindowsFeature
```

**Installés**

```powershell
Get-WindowsFeature | Where Installed
```

**Rôles Web**

```powershell
Get-WindowsFeature Web-*
```

*Mots-clés : get-windowsfeature rôle fonctionnalité serveur liste état installe 2025*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

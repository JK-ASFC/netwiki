---
title: "Install-Module"
description: "PowerShell — Install-Module (PowerShellGet) : Installe des modules PowerShell depuis la PowerShell Gallery. Le gestionnaire de paquets des modules et bibliothèques PowerShell."
tags: [powershell, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | PowerShellGet |
| **Commande type** | `Install-Module Pester` |

## Rôle

Installe des modules PowerShell depuis la PowerShell Gallery. Le gestionnaire de paquets des modules et bibliothèques PowerShell.

## Options

| Option | Rôle |
| --- | --- |
| `Find-Module` | cherche un module dans la Gallery |
| `Update-Module` | met à jour un module |
| `Uninstall-Module` | désinstalle |
| `-Scope CurrentUser` | installe sans droits admin |
| `-Force` | force la réinstallation |
| `-AllowClobber` | autorise l'écrasement de commandes |

## Exemples

**Installer pour soi**

```powershell
Install-Module Pester -Scope CurrentUser
```

**Chercher un module**

```powershell
Find-Module -Name Az
```

**Mettre à jour**

```powershell
Update-Module PSReadLine
```

*Mots-clés : install-module find-module powershellget gallery module powershell installer mettre à jour package update*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

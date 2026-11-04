---
title: "Get-WinEvent"
description: "PowerShell — Get-WinEvent (Analyse d'incidents) : Lit les journaux d'événements Windows."
tags: [powershell, commande, journaux-evenements]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Journaux & événements |
| **Contexte** | Analyse d'incidents |
| **Commande type** | `Get-WinEvent -LogName System -MaxEvents 50` |

## Rôle

Lit les journaux d'événements Windows.

## Options

| Option | Rôle |
| --- | --- |
| `-LogName ‹journal›` | System/Security/Application |
| `-MaxEvents ‹N›` | limite |
| `-FilterHashtable ‹@{...}›` | filtre avance |
| `-ProviderName ‹source›` | par source |

## Exemples

**50 derniers**

```powershell
Get-WinEvent -LogName System -MaxEvents 50
```

**Échecs de connexion**

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625}
```

*Mots-clés : événement journal log sécurité système erreur audit eventlog get-winevent*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

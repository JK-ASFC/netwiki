---
title: "Get-Content (logs Apache)"
description: "PowerShell — Get-Content (logs Apache) (Journaux / WAMP) : Consulte les journaux Apache (error.log, access.log) en direct sous Windows."
tags: [powershell, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Apache |
| **Contexte** | Journaux / WAMP |
| **Commande type** | `Get-Content -Tail 50 -Wait ‹error.log›` |

## Rôle

Consulte les journaux Apache (error.log, access.log) en direct sous Windows.

## Options

| Option | Rôle |
| --- | --- |
| `-Tail ‹N›` | affiche les N dernières lignes |
| `-Wait` | suit le fichier en temps réel (comme tail -f) |
| `(error.log)` | C:\Apache24\logs\error.log |
| `(access.log)` | C:\Apache24\logs\access.log |

## Exemples

**Suivre les erreurs**

```powershell
Get-Content -Tail 50 -Wait C:\Apache24\logs\error.log
```

**50 dernières lignes**

```powershell
Get-Content -Tail 50 C:\Apache24\logs\access.log
```

**Filtrer les 404**

```powershell
Select-String -Path C:\Apache24\logs\access.log -Pattern " 404 "
```

*Mots-clés : logs journal apache error access tail suivre windows wamp get-content*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

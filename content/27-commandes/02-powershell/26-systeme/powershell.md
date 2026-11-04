---
title: "powershell"
description: "PowerShell — powershell (Scripts & exécution) : Exécute un script PowerShell (.ps1) ou une commande."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Scripts & exécution |
| **Commande type** | `powershell -File script.ps1` |

## Rôle

Exécute un script PowerShell (.ps1) ou une commande.

## Options

| Option | Rôle |
| --- | --- |
| `-File ‹script.ps1›` | exécute un fichier de script |
| `-Command ‹commande›` | exécute une commande/expression |
| `-ExecutionPolicy ‹Bypass›` | contourne la politique (session) |
| `-NoProfile` | ignore le profil au démarrage |

## Exemples

**Exécuter un script (chemin)**

```powershell
.\script.ps1
```

**Via -File**

```powershell
powershell -File script.ps1
```

**Commande inline**

```powershell
powershell -Command "Get-Date"
```

**Autoriser (session)**

```powershell
powershell -ExecutionPolicy Bypass -File script.ps1
```

*Mots-clés : powershell script exécuter ps1 lancer run invoke call operator powershell*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

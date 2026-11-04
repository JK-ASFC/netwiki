---
title: "Invoke-Command"
description: "PowerShell — Invoke-Command (Administration multi-machines) : Exécute du code sur une/plusieurs machines."
tags: [powershell, commande, remoting]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Remoting |
| **Contexte** | Administration multi-machines |
| **Commande type** | `Invoke-Command -ComputerName srv01 -ScriptBlock { Get-Service }` |

## Rôle

Exécute du code sur une/plusieurs machines.

## Options

| Option | Rôle |
| --- | --- |
| `-ComputerName ‹hôtes›` | cibles |
| `-ScriptBlock { }` | code |
| `-FilePath ‹script.ps1›` | script local à distance |
| `-AsJob` | tâche de fond |

## Exemples

**Plusieurs machines**

```powershell
Invoke-Command -ComputerName srv01,srv02 -ScriptBlock { hostname }
```

**En arrière-plan**

```powershell
Invoke-Command -ComputerName srv01 -ScriptBlock { Get-Service } -AsJob
```

*Mots-clés : exécuter distant commande script parallèle remoting invoke-command*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

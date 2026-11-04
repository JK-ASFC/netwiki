---
title: "Set-ExecutionPolicy"
description: "PowerShell — Set-ExecutionPolicy (Sécurité PowerShell) : Contrôle l'exécution des scripts."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Sécurité PowerShell |
| **Commande type** | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |

## Rôle

Contrôle l'exécution des scripts.

## Options

| Option | Rôle |
| --- | --- |
| `RemoteSigned` | signe requise (distants) |
| `AllSigned` | tout signe |
| `Restricted` | aucun script |
| `-Scope ‹portée›` | portée |

## Exemples

**Politique courante**

```powershell
Get-ExecutionPolicy -List
```

**Autoriser scripts locaux**

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

*Mots-clés : exécution policy script signature sécurité remotesigned set-executionpolicy*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

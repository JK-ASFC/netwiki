---
title: "Get-ChildItem Env:"
description: "PowerShell — Get-ChildItem Env: (Environnement / Variables) : Liste les variables d'environnement (= printenv)."
tags: [powershell, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Environnement & variables |
| **Contexte** | Environnement / Variables |
| **Commande type** | `Get-ChildItem Env:` |

## Rôle

Liste les variables d'environnement (= printenv).

## Options

| Option | Rôle |
| --- | --- |
| `Env:` | lecteur des variables |
| `Name,Value` | colonnes utiles |
| `$env:VAR` | accès direct |
| `Where-Object` | filtrer |

## Exemples

**Toutes**

```powershell
Get-ChildItem Env:
```

**Une variable**

```powershell
$env:PATH
```

**Filtrer**

```powershell
Get-ChildItem Env: | Where-Object Name -like "*PROXY*"
```

*Mots-clés : variables environnement lister printenv env get-childitem*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

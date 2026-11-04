---
title: ". (dot-source)"
description: "PowerShell — . (dot-source) (Environnement / Shell) : Exécute un script dans la portée courante (dot-sourcing = source)."
tags: [powershell, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Environnement & variables |
| **Contexte** | Environnement / Shell |
| **Commande type** | `. .\config.ps1` |

## Rôle

Exécute un script dans la portée courante (dot-sourcing = source).

## Options

| Option | Rôle |
| --- | --- |
| `.` | opérateur de dot-sourcing |
| `.\script.ps1` | charge variables et fonctions |
| `$PROFILE` | le profil PowerShell |
| `(scope)` | reste dans la session |

## Exemples

**Charger un script**

```powershell
. .\config.ps1
```

**Recharger le profil**

```powershell
. $PROFILE
```

**Charger des fonctions**

```powershell
. .\lib\helpers.ps1
```

*Mots-clés : sourcer charger dot-source portée script source point*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

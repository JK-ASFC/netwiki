---
title: "Get-Location"
description: "PowerShell — Get-Location (Navigation / Répertoires) : Affiche le répertoire de travail courant (alias pwd, gl)."
tags: [powershell, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Navigation / Répertoires |
| **Commande type** | `Get-Location` |

## Rôle

Affiche le répertoire de travail courant (alias pwd, gl).

## Options

| Option | Rôle |
| --- | --- |
| `-Stack` | pile de répertoires |
| `pwd` | alias |
| `(sans arg)` | chemin courant |

## Exemples

**Ou suis-je**

```powershell
Get-Location
```

**Via l'alias**

```powershell
pwd
```

**La valeur**

```powershell
$PWD.Path
```

*Mots-clés : répertoire courant chemin afficher pwd get-location*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

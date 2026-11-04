---
title: "Set-Location"
description: "PowerShell — Set-Location (Navigation / Répertoires) : Change de répertoire courant (alias cd, sl)."
tags: [powershell, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Navigation / Répertoires |
| **Commande type** | `Set-Location C:\Logs` |

## Rôle

Change de répertoire courant (alias cd, sl).

## Options

| Option | Rôle |
| --- | --- |
| `-Path ‹chemin›` | chemin cible |
| `..` | remonte d'un niveau |
| `-` | répertoire précédent (PS 6+) |
| `cd` | alias |

## Exemples

**Aller quelque part**

```powershell
Set-Location C:\Logs
```

**Remonter**

```powershell
Set-Location ..
```

**Via l'alias**

```powershell
cd $HOME
```

*Mots-clés : naviguer répertoire dossier changer cd set-location*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

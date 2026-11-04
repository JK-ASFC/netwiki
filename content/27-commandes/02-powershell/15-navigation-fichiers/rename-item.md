---
title: "Rename-Item"
description: "PowerShell — Rename-Item (Fichiers / Renommage) : Renomme un fichier ou un dossier."
tags: [powershell, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Renommage |
| **Commande type** | `Rename-Item ancien.txt nouveau.txt` |

## Rôle

Renomme un fichier ou un dossier.

## Options

| Option | Rôle |
| --- | --- |
| `-NewName ‹nouveau nom›` | nouveau nom |
| `-Path ‹chemin›` | élément cible |
| `-Force` | remplace |
| `(meme dossier)` | renomme sur place |

## Exemples

**Renommer**

```powershell
Rename-Item ancien.txt nouveau.txt
```

**Avec chemin**

```powershell
Rename-Item C:\data\a.log b.log
```

**Forcer**

```powershell
Rename-Item -Force a.txt b.txt
```

*Mots-clés : renommer fichier dossier rename-item*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

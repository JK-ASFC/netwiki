---
title: "New-Item"
description: "PowerShell — New-Item (Fichiers / Création) : Crée fichier, dossier ou lien (= touch / mkdir / ln)."
tags: [powershell, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Création |
| **Commande type** | `New-Item -ItemType File rapport.txt` |

## Rôle

Crée fichier, dossier ou lien (= touch / mkdir / ln).

## Options

| Option | Rôle |
| --- | --- |
| `-ItemType File` | fichier (= touch) |
| `-ItemType Directory` | dossier (= mkdir) |
| `-ItemType SymbolicLink` | lien |
| `-Force` | crée les parents |
| `-Target ‹cible›` | cible d'un lien symbolique |

## Exemples

**Un fichier**

```powershell
New-Item -ItemType File rapport.txt
```

**Un dossier**

```powershell
New-Item -ItemType Directory -Force projet\src
```

**Un lien**

```powershell
New-Item -ItemType SymbolicLink -Path lien -Target C:\data
```

*Mots-clés : créer fichier dossier lien répertoire new-item*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

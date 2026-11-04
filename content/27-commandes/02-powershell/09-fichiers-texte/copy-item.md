---
title: "Copy-Item"
description: "PowerShell — Copy-Item (Administration fichiers) : Copie fichiers/dossiers. Alias : cp, copy."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Administration fichiers |
| **Commande type** | `Copy-Item src dst -Recurse` |

## Rôle

Copie fichiers/dossiers. Alias : cp, copy.

## Options

| Option | Rôle |
| --- | --- |
| `-Recurse` | récursif |
| `-Force` | écrase |
| `-Filter ‹motif›` | filtre |
| `Move-Item` | déplace |

## Exemples

**Copier un dossier**

```powershell
Copy-Item C:\src D:\dst -Recurse
```

**Déplacer**

```powershell
Move-Item a.txt D:\archive\
```

*Mots-clés : copier fichier dossier récursif déplacer copy-item*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

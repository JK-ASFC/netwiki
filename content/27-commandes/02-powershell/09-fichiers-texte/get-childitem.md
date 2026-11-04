---
title: "Get-ChildItem"
description: "PowerShell — Get-ChildItem (Audit & scripts) : Parcourt fichiers/dossiers. Alias : gci, ls, dir."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Audit & scripts |
| **Commande type** | `Get-ChildItem -Recurse -Filter *.log -File` |

## Rôle

Parcourt fichiers/dossiers. Alias : gci, ls, dir.

## Options

| Option | Rôle |
| --- | --- |
| `-Path ‹chemin›` | départ |
| `-Recurse` | récursif |
| `-Filter ‹motif›` | filtre |
| `-File/-Directory` | fichiers/dossiers |
| `-Force` | caches |

## Exemples

**.log recursifs**

```powershell
Get-ChildItem -Recurse -Filter *.log
```

**> 100 Mo**

```powershell
Get-ChildItem -Recurse -File | Where Length -gt 100MB
```

*Mots-clés : lister fichiers dossier récursif caches ls dir gci get-childitem*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

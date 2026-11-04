---
title: "Get-ChildItem (recherche)"
description: "PowerShell — Get-ChildItem (recherche) (Recherche de fichiers) : Parcourt une arborescence pour trouver des fichiers : l'équivalent de find."
tags: [powershell, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Recherche |
| **Contexte** | Recherche de fichiers |
| **Commande type** | `Get-ChildItem -Recurse -Filter *.log` |

## Rôle

Parcourt une arborescence pour trouver des fichiers : l'équivalent de find.

## Options

| Option | Rôle |
| --- | --- |
| `-Recurse` | descend dans les sous-dossiers |
| `-Filter ‹motif›` | filtre rapide par nom (*.log) |
| `-Include ‹motif›` | inclut selon un motif (avec -Recurse) |
| `-Exclude ‹motif›` | exclut selon un motif |
| `-File` | fichiers seulement |
| `-Directory` | dossiers seulement |
| `-Depth ‹N›` | profondeur maximale |
| `-Force` | inclut caches et système |

## Exemples

**Tous les .log**

```powershell
Get-ChildItem -Recurse -Filter *.log
```

**Gros fichiers**

```powershell
Get-ChildItem -Recurse -File | Where-Object Length -gt 100MB
```

**Modifiés récemment**

```powershell
Get-ChildItem -Recurse | Where-Object LastWriteTime -gt (Get-Date).AddDays(-1)
```

*Mots-clés : rechercher fichier arborescence récursif find gci filter chercher localiser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

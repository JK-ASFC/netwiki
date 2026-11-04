---
title: "Clear-Content (truncate Windows)"
description: "PowerShell — Clear-Content (truncate Windows) (Écrire un fichier (= truncate -s 0)) : Vide le contenu d'un fichier sans le supprimer : le pendant de truncate -s 0. Pour une taille exacte, il n'existe pas de cmdlet : il faut passer par .NET."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Écrire un fichier (= truncate -s 0) |
| **Commande type** | `Clear-Content C:\logs\app.log` |

## Rôle

Vide le contenu d'un fichier sans le supprimer : le pendant de truncate -s 0. Pour une taille exacte, il n'existe pas de cmdlet : il faut passer par .NET.

## Options

| Option | Rôle |
| --- | --- |
| `‹fichier›` | fichier(s) à vider |
| `-WhatIf` | simule sans rien vider |
| ⚠️ `-Force` | vide aussi un fichier en lecture seule |
| `-Stream ‹flux›` | flux de données alternatif (Windows) |
| `-Filter ‹filtre›` | filtre au niveau du fournisseur |
| `(alias) clc` | nom court de la cmdlet |
| `(taille exacte) [IO.File]::Open(...).SetLength(...)` | équivalent de truncate -s N |

> [!WARNING]
> Options à manier avec précaution : `-Force`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Vider un fichier**

```powershell
Clear-Content C:\logs\app.log
```

**Simuler sur tous les journaux**

```powershell
Clear-Content C:\logs\*.log -WhatIf
```

**Fixer une taille exacte de 10 Mio**

```powershell
$f = [IO.File]::Open('C:\temp\disque.img','OpenOrCreate'); $f.SetLength(10MB); $f.Close()
```

*Mots-clés : clear-content clc vider truncate fichier contenu journal log powershell stream*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

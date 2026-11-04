---
title: "Measure-Object"
description: "PowerShell — Measure-Object (Fichiers / Comptage) : Compte lignes, mots, caractères ou calcule des stats (= wc)."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Comptage |
| **Commande type** | `Get-Content app.log \| Measure-Object -Line` |

## Rôle

Compte lignes, mots, caractères ou calcule des stats (= wc).

## Options

| Option | Rôle |
| --- | --- |
| `-Line` | lignes (= wc -l) |
| `-Word` | mots |
| `-Character` | caractères |
| `-Sum` | somme d'une propriété |

## Exemples

**Compter les lignes**

```powershell
Get-Content app.log | Measure-Object -Line
```

**Nombre de fichiers**

```powershell
Get-ChildItem | Measure-Object
```

**Taille totale**

```powershell
Get-ChildItem | Measure-Object Length -Sum
```

*Mots-clés : compter lignes mots caractères statistiques wc measure-object*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

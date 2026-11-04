---
title: "Compare-Object"
description: "PowerShell — Compare-Object (Fichiers / Comparaison) : Compare deux ensembles d'objets ou fichiers (= diff)."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Comparaison |
| **Commande type** | `Compare-Object (Get-Content a.txt) (Get-Content b.txt)` |

## Rôle

Compare deux ensembles d'objets ou fichiers (= diff).

## Options

| Option | Rôle |
| --- | --- |
| `-ReferenceObject ‹référence›` | référence |
| `-DifferenceObject ‹comparé›` | à comparer |
| `-IncludeEqual` | montre aussi les identiques |
| `-Property ‹propriété›` | propriété précise |

## Exemples

**Deux fichiers**

```powershell
Compare-Object (Get-Content a.txt) (Get-Content b.txt)
```

**Avec les égaux**

```powershell
Compare-Object $a $b -IncludeEqual
```

**Sur une propriété**

```powershell
Compare-Object $a $b -Property Name
```

*Mots-clés : comparer différence fichiers objets diff compare-object*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

---
title: "Select-Object"
description: "PowerShell — Select-Object (Fichiers / Projection) : Sélectionne des propriétés ou des lignes (= cut / head / tail)."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Projection |
| **Commande type** | `Get-Process \| Select-Object Name,CPU` |

## Rôle

Sélectionne des propriétés ou des lignes (= cut / head / tail).

## Options

| Option | Rôle |
| --- | --- |
| `-Property ‹propriétés›` | colonnes à garder |
| `-First ‹N›` | N premiers (= head) |
| `-Last ‹N›` | N derniers (= tail) |
| `-Unique` | valeurs uniques |

## Exemples

**Des colonnes**

```powershell
Get-Process | Select-Object Name,CPU
```

**Les 5 premiers**

```powershell
Get-Process | Select-Object -First 5
```

**Valeurs uniques**

```powershell
$data | Select-Object Ville -Unique
```

*Mots-clés : sélectionner colonnes propriétés premières cut head select-object*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

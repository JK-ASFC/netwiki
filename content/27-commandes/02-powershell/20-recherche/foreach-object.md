---
title: "ForEach-Object"
description: "PowerShell — ForEach-Object (Traiter chaque élément (= xargs/awk)) : Applique un traitement à chaque objet du pipeline. Réunit les usages de xargs (agir sur chaque résultat) et d'awk (extraire/calculer par élément)."
tags: [powershell, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Recherche |
| **Contexte** | Traiter chaque élément (= xargs/awk) |
| **Commande type** | `Get-ChildItem *.log \| ForEach-Object { $_.Length }` |

## Rôle

Applique un traitement à chaque objet du pipeline. Réunit les usages de xargs (agir sur chaque résultat) et d'awk (extraire/calculer par élément).

## Options

| Option | Rôle |
| --- | --- |
| `{ $_ }` | $_ désigne l'objet courant du pipeline |
| `{ $_.Propriété }` | extrait une propriété (= awk '{print $N}') |
| `-Begin { } -Process { } -End { }` | initialisation, traitement, finalisation |
| `-Parallel { }` | traite en parallèle (PowerShell 7+) |

## Exemples

**Extraire une colonne**

```powershell
Get-Process | ForEach-Object { $_.Name }
```

**Agir sur chaque fichier**

```powershell
Get-ChildItem *.tmp | ForEach-Object { Remove-Item $_ }
```

**Calcul par élément**

```powershell
1..5 | ForEach-Object { $_ * $_ }
```

*Mots-clés : xargs awk foreach-object pipeline boucle chaque élément traiter*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

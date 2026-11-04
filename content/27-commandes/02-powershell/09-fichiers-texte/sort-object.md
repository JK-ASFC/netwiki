---
title: "Sort-Object"
description: "PowerShell — Sort-Object (Fichiers / Tri) : Trie des objets selon une ou plusieurs propriétés (= sort)."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Tri |
| **Commande type** | `Get-ChildItem \| Sort-Object Length -Descending` |

## Rôle

Trie des objets selon une ou plusieurs propriétés (= sort).

## Options

| Option | Rôle |
| --- | --- |
| `-Property ‹propriétés›` | propriété de tri |
| `-Descending` | ordre inverse |
| `-Unique` | supprime les doublons |
| `(plusieurs)` | tri multi-niveaux |

## Exemples

**Par taille**

```powershell
Get-ChildItem | Sort-Object Length -Descending
```

**Uniques**

```powershell
$liste | Sort-Object -Unique
```

**Multi-critères**

```powershell
Get-ChildItem | Sort-Object Extension,Name
```

*Mots-clés : trier ordonner objets propriété sort sort-object*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

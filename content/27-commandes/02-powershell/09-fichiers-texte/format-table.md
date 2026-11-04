---
title: "Format-Table"
description: "PowerShell — Format-Table (Mettre en forme la sortie) : Affiche les objets en tableau (alias : ft). Format-List (fl) affiche en liste détaillée."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Mettre en forme la sortie |
| **Commande type** | `Format-Table -AutoSize` |

## Rôle

Affiche les objets en tableau (alias : ft). Format-List (fl) affiche en liste détaillée.

## Options

| Option | Rôle |
| --- | --- |
| `-AutoSize` | ajuste la largeur des colonnes |
| `-Property ‹p1,p2›` | colonnes à afficher |
| `-Wrap` | passe à la ligne au lieu de tronquer |
| `(Format-List / fl)` | affichage vertical détaillé |

## Exemples

**Tableau ajusté**

```powershell
Get-Service | Format-Table -AutoSize
```

**Colonnes choisies**

```powershell
Get-Process | ft Name,CPU,WS
```

**Tout en liste**

```powershell
Get-Service Win* | Format-List *
```

*Mots-clés : format-table ft tableau affichage colonne format-list fl autosize sortie*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

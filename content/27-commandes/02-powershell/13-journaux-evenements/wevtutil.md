---
title: "wevtutil"
description: "PowerShell — wevtutil (Analyse d'incidents) : Outil natif des journaux (export, requête)."
tags: [powershell, commande, journaux-evenements]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Journaux & événements |
| **Contexte** | Analyse d'incidents |
| **Commande type** | `wevtutil qe System /c:20 /rd:true /f:text` |

## Rôle

Outil natif des journaux (export, requête).

## Options

| Option | Rôle |
| --- | --- |
| `qe` | interroge |
| `el` | liste les journaux |
| `cl` | efface un journal |
| `/c:N` | nombre |
| `/rd:true` | récents d'abord |

## Exemples

**20 derniers**

```powershell
wevtutil qe System /c:20 /rd:true /f:text
```

**Lister les journaux**

```powershell
wevtutil el
```

*Mots-clés : événement journal export requête effacer wevtutil*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

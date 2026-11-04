---
title: "Get-Unique"
description: "PowerShell — Get-Unique (Dédupliquer) : Supprime les doublons consécutifs d'une liste triée. Alias : gu. Équivaut à uniq."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Dédupliquer |
| **Commande type** | `Get-Unique` |

## Rôle

Supprime les doublons consécutifs d'une liste triée. Alias : gu. Équivaut à uniq.

## Options

| Option | Rôle |
| --- | --- |
| `-CaseInsensitive` | ignore la casse |
| `(Sort-Object -Unique)` | trie ET déduplique en une seule étape |

## Exemples

**Trier puis dédup**

```powershell
Get-Content ips.txt | Sort-Object | Get-Unique
```

**Plus simple**

```powershell
Get-Content ips.txt | Sort-Object -Unique
```

**Sans casse**

```powershell
$mots | Sort-Object | Get-Unique -CaseInsensitive
```

*Mots-clés : get-unique gu unique doublon dedupliquer sort-object trie*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

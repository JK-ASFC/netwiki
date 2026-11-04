---
title: "regex (-match / -replace)"
description: "PowerShell — regex (-match / -replace) (Recherche / .NET) : Opérateurs regex de PowerShell : -match teste, -replace remplace, $matches capture."
tags: [powershell, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Recherche |
| **Contexte** | Recherche / .NET |
| **Commande type** | `'IP 10.0.0.1' -match '\d+\.\d+'` |

## Rôle

Opérateurs regex de PowerShell : -match teste, -replace remplace, $matches capture.

## Options

| Option | Rôle |
| --- | --- |
| `-match` | teste si le motif est présent (vrai/faux + remplit $matches) |
| `-notmatch` | vrai si le motif est absent |
| `-replace` | remplace le motif par un texte |
| `-cmatch` | variante sensible à la casse |
| `$matches` | captures après un -match réussi |
| `(?<nom>...)` | groupe nomme, lu via $matches['nom'] |

## Exemples

**Tester un motif**

```powershell
'IP 10.0.0.1' -match '\d+\.\d+'
```

**Lire la capture**

```powershell
$matches[0]
```

**Remplacer des tirets**

```powershell
'2026-06-27' -replace '-','/'
```

*Mots-clés : regex match replace cmatch matches motif powershell net filtrer chercher*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

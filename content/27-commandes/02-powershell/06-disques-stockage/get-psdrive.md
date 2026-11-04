---
title: "Get-PSDrive"
description: "PowerShell — Get-PSDrive (Disques / Espace) : Liste les lecteurs et l'espace libre/utilise (= df)."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Disques / Espace |
| **Commande type** | `Get-PSDrive -PSProvider FileSystem` |

## Rôle

Liste les lecteurs et l'espace libre/utilise (= df).

## Options

| Option | Rôle |
| --- | --- |
| `-PSProvider FileSystem` | disques seulement |
| `.Free` | espace libre |
| `.Used` | espace utilise |
| `(sans arg)` | tous les lecteurs PS |

## Exemples

**Disques**

```powershell
Get-PSDrive -PSProvider FileSystem
```

**Espace d'un lecteur**

```powershell
Get-PSDrive C | Select Used,Free
```

**Tous**

```powershell
Get-PSDrive
```

*Mots-clés : espace libre utilise disque lecteur df get-psdrive*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

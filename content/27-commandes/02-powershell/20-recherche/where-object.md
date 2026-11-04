---
title: "Where-Object"
description: "PowerShell — Where-Object (Recherche / filtrage objets) : Filtre les objets d'un pipeline selon une condition : le grep côté objets."
tags: [powershell, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Recherche |
| **Contexte** | Recherche / filtrage objets |
| **Commande type** | `Get-Process \| Where-Object CPU -gt 100` |

## Rôle

Filtre les objets d'un pipeline selon une condition : le grep côté objets.

## Options

| Option | Rôle |
| --- | --- |
| `-eq ‹valeur›` | égal à |
| `-ne ‹valeur›` | différent de |
| `-gt ‹valeur›` | supérieur à |
| `-lt ‹valeur›` | inférieur à |
| `-ge ‹valeur›` | supérieur ou égal |
| `-le ‹valeur›` | inférieur ou égal |
| `-like ‹motif›` | motif avec jokers (* ?) |
| `-match ‹regex›` | correspond à une regex |
| `-notmatch ‹regex›` | ne correspond pas |
| `(forme complète dans un pipeline : … \| Where-Object { $_.propriété -opérateur valeur })` |  |

## Exemples

**Processus gourmands**

```powershell
Get-Process | Where-Object CPU -gt 100
```

**Services arrêtés**

```powershell
Get-Service | Where-Object Status -eq Stopped
```

**Filtre regex sur le nom**

```powershell
Get-ChildItem | Where-Object Name -match '\.log$'
```

*Mots-clés : where-object filtre condition pipeline objet sélectionner match regex ou where*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

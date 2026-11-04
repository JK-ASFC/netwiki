---
title: "lscpu"
description: "Bash — lscpu (Inventaire matériel) : Architecture CPU : coeurs, threads, cache, virtualisation."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Inventaire matériel |
| **Commande type** | `lscpu` |

## Rôle

Architecture CPU : coeurs, threads, cache, virtualisation.

## Options

| Option | Rôle |
| --- | --- |
| `-e` | format étendu (table) |
| `-p` | format parsable (CSV) |
| `--all` | inclut les CPU hors-ligne |

## Exemples

**Infos CPU**

```bash
lscpu
```

**En table**

```bash
lscpu -e
```

*Mots-clés : cpu processeur coeurs architecture matériel lscpu sysfs*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

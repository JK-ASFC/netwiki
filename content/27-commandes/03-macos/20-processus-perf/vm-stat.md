---
title: "vm_stat"
description: "macOS — vm_stat (Mémoire) : Statistiques d'utilisation de la mémoire virtuelle (l'équivalent de free sous macOS)."
tags: [macos, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Processus & perf |
| **Contexte** | Mémoire |
| **Commande type** | `vm_stat` |

## Rôle

Statistiques d'utilisation de la mémoire virtuelle (l'équivalent de free sous macOS).

## Options

| Option | Rôle |
| --- | --- |
| `(sans arg)` | pages libres, actives, inactives, compressées |
| `‹secondes›` | rafraîchit à intervalle régulier |
| `-c ‹N› ‹sec›` | N relevés espacés de sec secondes |

## Exemples

**État mémoire**

```zsh
vm_stat
```

**Rafraîchi toutes les 2 s**

```zsh
vm_stat 2
```

**Pression mémoire (résumé)**

```zsh
memory_pressure
```

*Mots-clés : mémoire ram vm_stat free pages virtuelle libre pression*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

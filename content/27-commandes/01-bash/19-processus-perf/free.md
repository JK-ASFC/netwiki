---
title: "free"
description: "Bash — free (Diagnostic de performance) : RAM et swap utilisés / disponibles."
tags: [bash, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Processus & perf |
| **Contexte** | Diagnostic de performance |
| **Commande type** | `free -h` |

## Rôle

RAM et swap utilisés / disponibles.

## En détail

Affiche la mémoire vive (RAM) totale, utilisée et disponible. Pour vérifier d'un coup d'oeil si la machine manque de mémoire.

## Options

| Option | Rôle |
| --- | --- |
| `-h` | tailles lisibles |
| `-m` | en Mo |
| `-s ‹N›` | toutes les N s |

## Exemples

**Surveiller en continu**

```bash
free -h -s 2
```

*Mots-clés : mémoire ram swap libre disponible free*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

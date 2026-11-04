---
title: "pgrep"
description: "Bash — pgrep (Recherche de process) : Trouve les PID des processus par nom ou motif."
tags: [bash, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Processus & perf |
| **Contexte** | Recherche de process |
| **Commande type** | `pgrep -a sshd` |

## Rôle

Trouve les PID des processus par nom ou motif.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | affiche la ligne de commande complète |
| `-l` | affiche le nom du process |
| `-f` | cherche dans toute la ligne de commande |
| `-u ‹utilisateur›` | limite à un utilisateur |
| `-x` | correspondance exacte du nom |
| `-c` | compte les correspondances |

## Exemples

**PID par nom**

```bash
pgrep sshd
```

**Avec la commande**

```bash
pgrep -a sshd
```

## Dans les autres shells

- [[27-commandes/03-macos/20-processus-perf/pgrep|pgrep (macOS)]]

*Mots-clés : pid processus chercher nom motif pgrep grep process*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

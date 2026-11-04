---
title: "ps"
description: "macOS — ps (Diagnostic de performance) : Instantané des processus, tries par mémoire."
tags: [macos, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Processus & perf |
| **Contexte** | Diagnostic de performance |
| **Commande type** | `ps aux --sort=-%mem` |

## Rôle

Instantané des processus, tries par mémoire.

## En détail

Liste les programmes en cours d'exécution (les processus) avec leur identifiant (PID). Point de départ pour retrouver puis agir sur un programme.

## Options

| Option | Rôle |
| --- | --- |
| `a` | tous les utilisateurs (pas seulement les votres) |
| `x` | inclut les processus sans terminal (démons, services) |
| `u / l` | format d'affichage : u = oriente utilisateur (%CPU %MEM) · l = format long, montre PRI et NI (la valeur nice) |
| `--sort=‹champ›` | clé de tri (ex : -%cpu, -%mem) |
| `Z` | affiche le contexte de sécurité SELinux de chaque processus (colonne LABEL ; se cumule aux lettres BSD, ex. ps auxZ) |

## Exemples

**Priorité et nice (format long)**

```zsh
ps axl
```

**Top 5 CPU**

```zsh
ps aux --sort=-%cpu | head -6
```

**PID d'un service**

```zsh
ps -ef | grep nginx
```

**Contexte SELinux**

```zsh
ps -eZ
```

## Dans les autres shells

- [[27-commandes/01-bash/19-processus-perf/ps|ps (Bash)]]

*Mots-clés : processus pid mémoire cpu top tâche running ps*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

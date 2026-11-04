---
title: "top / htop"
description: "macOS — top / htop (Diagnostic de performance) : Moniteur temps réel ; htop = interactif."
tags: [macos, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Processus & perf |
| **Contexte** | Diagnostic de performance |
| **Commande type** | `top -b -o %MEM -n 1 \| head -15` |

## Rôle

Moniteur temps réel ; htop = interactif.

## En détail

Affiche en direct les processus qui consomment le plus de processeur et de mémoire, comme un gestionnaire des tâches. htop en est la version plus lisible.

## Options

| Option | Rôle |
| --- | --- |
| `-o ‹champ›` | colonne de tri |
| `-b` | mode batch (scriptable) |
| `-n ‹N›` | N rafraichissements |
| `htop` | interface interactive |

## Exemples

**Top mémoire en une passe**

```zsh
top -b -o %MEM -n 1 | head -15
```

**Interface riche**

```zsh
htop
```

## Dans les autres shells

- [[27-commandes/01-bash/19-processus-perf/top-htop|top / htop (Bash)]]

*Mots-clés : moniteur processus cpu mémoire temps réel charge top htop*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

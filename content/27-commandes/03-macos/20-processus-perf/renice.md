---
title: "renice"
description: "macOS — renice (Priorités) : Change la priorité (nice) d'un processus déjà lancé."
tags: [macos, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Processus & perf |
| **Contexte** | Priorités |
| **Commande type** | `renice -n 10 -p 1234` |

## Rôle

Change la priorité (nice) d'un processus déjà lancé.

## Options

| Option | Rôle |
| --- | --- |
| `-n ‹priorite›` | nouvelle valeur nice (-20 à 19) |
| `-p ‹PID›` | cible un PID |
| `-u ‹utilisateur›` | cible tous les process d'un utilisateur |
| `-g ‹groupe›` | cible un groupe |

## Exemples

**Baisser la priorité**

```zsh
renice -n 10 -p 1234
```

**Tous les process d'un user**

```zsh
renice -n 5 -u bob
```

## Dans les autres shells

- [[27-commandes/01-bash/19-processus-perf/renice|renice (Bash)]]

*Mots-clés : priorité nice processus renice cpu ralentir prioriser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

---
title: "sleep"
description: "macOS — sleep (Temporisation) : Met en pause pendant une durée (scripts, boucles)."
tags: [macos, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Processus & perf |
| **Contexte** | Temporisation |
| **Commande type** | `sleep 10` |

## Rôle

Met en pause pendant une durée (scripts, boucles).

## Options

| Option | Rôle |
| --- | --- |
| `(s = secondes (defaut), m = minutes, h = heures, d = jours)` |  |

## Exemples

**10 secondes**

```zsh
sleep 10
```

**5 minutes**

```zsh
sleep 5m
```

**Enchainer**

```zsh
sleep 3 && echo fini
```

## Dans les autres shells

- [[27-commandes/01-bash/19-processus-perf/sleep|sleep (Bash)]]

*Mots-clés : pause attendre délai temporisation sleep secondes minutes*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

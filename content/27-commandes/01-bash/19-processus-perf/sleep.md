---
title: "sleep"
description: "Bash — sleep (Temporisation) : Met en pause pendant une durée (scripts, boucles)."
tags: [bash, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
sleep 10
```

**5 minutes**

```bash
sleep 5m
```

**Enchainer**

```bash
sleep 3 && echo fini
```

## Dans les autres shells

- [[27-commandes/03-macos/20-processus-perf/sleep|sleep (macOS)]]

*Mots-clés : pause attendre délai temporisation sleep secondes minutes*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

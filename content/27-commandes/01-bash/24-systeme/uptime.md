---
title: "uptime"
description: "Bash — uptime (Charge & disponibilité) : Depuis combien de temps la machine tourne, et la charge moyenne (1/5/15 min)."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Charge & disponibilité |
| **Commande type** | `uptime` |

## Rôle

Depuis combien de temps la machine tourne, et la charge moyenne (1/5/15 min).

## Options

| Option | Rôle |
| --- | --- |
| `-p` | format lisible (pretty) |
| `-s` | date exacte du démarrage |

## Exemples

**Charge actuelle**

```bash
uptime
```

**Lisible**

```bash
uptime -p
```

**Démarré quand**

```bash
uptime -s
```

## Dans les autres shells

- [[27-commandes/03-macos/25-systeme/uptime|uptime (macOS)]]

*Mots-clés : uptime charge load disponibilité depuis démarrage moyenne*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

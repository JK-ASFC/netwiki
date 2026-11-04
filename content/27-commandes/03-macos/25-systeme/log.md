---
title: "log"
description: "macOS — log (Journaux système) : Consulte et suit le journal unifié de macOS (l'équivalent de journalctl)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Journaux système |
| **Commande type** | `log show --last 1h` |

## Rôle

Consulte et suit le journal unifié de macOS (l'équivalent de journalctl).

## Options

| Option | Rôle |
| --- | --- |
| `show` | affiche les journaux passés |
| `--last ‹1h/30m/2d›` | limite à la période récente |
| `--predicate ‹'…'›` | filtre (ex. 'process == "sshd"') |
| `--info` | inclut les messages de niveau info |
| `--debug` | inclut le niveau debug |
| `stream` | suit les journaux en direct (comme tail -f) |
| `--style ‹syslog/json/compact›` | format de sortie |

## Exemples

**Dernière heure**

```zsh
log show --last 1h
```

**Suivre un process en direct**

```zsh
log stream --predicate 'process == "sshd"'
```

**Erreurs récentes**

```zsh
log show --last 30m --predicate 'messageType == error'
```

*Mots-clés : logs journaux journal unifié log show stream diagnostic*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

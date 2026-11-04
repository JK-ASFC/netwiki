---
title: "shutdown"
description: "macOS — shutdown (Arrêt & redémarrage) : Arrête ou redémarre la machine (version BSD)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Arrêt & redémarrage |
| **Commande type** | `sudo shutdown -h now` |

## Rôle

Arrête ou redémarre la machine (version BSD).

## Options

| Option | Rôle |
| --- | --- |
| `-h now` | arrête immédiatement |
| `-r now` | redémarre immédiatement |
| `-h +‹minutes›` | arrêt différé |
| `-s` | met en veille (sleep) |

## Exemples

**Arrêter**

```zsh
sudo shutdown -h now
```

**Redémarrer**

```zsh
sudo shutdown -r now
```

**Arrêt dans 10 min**

```zsh
sudo shutdown -h +10
```

## Dans les autres shells

- [[27-commandes/01-bash/24-systeme/shutdown|shutdown (Bash)]]

*Mots-clés : arrêt redémarrage shutdown reboot halt eteindre*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

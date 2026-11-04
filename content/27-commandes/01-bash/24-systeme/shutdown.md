---
title: "shutdown"
description: "Bash — shutdown (Arrêt & redémarrage) : Arrête ou redémarre le système, immédiatement ou programme."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Arrêt & redémarrage |
| **Commande type** | `shutdown +120` |

## Rôle

Arrête ou redémarre le système, immédiatement ou programme.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `now` | immédiat |
| `+‹N›` | dans N minutes (ex : +10 ; « now » pour immédiat) |
| `-r` | redémarre (reboot) |
| `-h` | arrête (halt/poweroff) |
| `-c` | annule un arrêt programme |

> [!WARNING]
> Options à manier avec précaution : `now`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Dans 2 heures**

```bash
shutdown +120
```

**Redémarrer maintenant**

```bash
shutdown -r now
```

**Annuler**

```bash
shutdown -c
```

## Dans les autres shells

- [[27-commandes/03-macos/25-systeme/shutdown|shutdown (macOS)]]

*Mots-clés : arrêt eteindre redémarrer reboot halt poweroff planifie shutdown*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

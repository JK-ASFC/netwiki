---
title: "iostat"
description: "macOS — iostat (Statistiques disque) : Statistiques d'entrées/sorties disque et CPU, rafraîchies périodiquement."
tags: [macos, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Disques & stockage |
| **Contexte** | Statistiques disque |
| **Commande type** | `iostat -w 2` |

## Rôle

Statistiques d'entrées/sorties disque et CPU, rafraîchies périodiquement.

## En détail

Affiche l'activité des disques (lectures et écritures) et du processeur. Sert à repérer un disque qui ralentit la machine.

## Options

| Option | Rôle |
| --- | --- |
| `-w ‹secondes›` | intervalle de rafraîchissement |
| `-d` | disques seulement |
| `-c ‹N›` | nombre de relevés |
| `-n ‹N›` | nombre de disques affichés |

## Exemples

**Débit toutes les 2 s**

```zsh
iostat -w 2
```

**Cinq relevés**

```zsh
iostat -w 1 -c 5
```

## Dans les autres shells

- [[27-commandes/01-bash/07-disques-stockage/iostat|iostat (Bash)]]

*Mots-clés : io disque débit performance iostat statistiques*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

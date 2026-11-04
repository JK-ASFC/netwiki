---
title: "lsof"
description: "macOS — lsof (Forensic / Investigation) : Quels processus ouvrent quels fichiers/ports."
tags: [macos, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Processus & perf |
| **Contexte** | Forensic / Investigation |
| **Commande type** | `lsof -i :443` |

## Rôle

Quels processus ouvrent quels fichiers/ports.

## En détail

Liste les fichiers ouverts et par quel programme, y compris les connexions réseau. Sert à savoir qui utilise un fichier ou un port.

## Options

| Option | Rôle |
| --- | --- |
| `-i ‹:port›` | sockets sur un port |
| `-p ‹PID›` | fichiers d'un processus |
| `-u ‹utilisateur›` | par utilisateur |
| `-nP` | sans résolution |

## Exemples

**Qui écoute sur un port**

```zsh
sudo lsof -nP -i :443
```

**Fichiers d'un PID**

```zsh
lsof -p 1234
```

## Dans les autres shells

- [[27-commandes/01-bash/19-processus-perf/lsof|lsof (Bash)]]
- [[27-commandes/03-macos/22-reseau/lsof|lsof (macOS)]]

*Mots-clés : fichiers ouverts ports processus réseau qui utilise lsof socket*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

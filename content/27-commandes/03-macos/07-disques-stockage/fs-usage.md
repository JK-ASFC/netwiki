---
title: "fs_usage"
description: "macOS — fs_usage (E/S disque en direct) : Trace en temps réel les accès au système de fichiers (diagnostic d'E/S)."
tags: [macos, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Disques & stockage |
| **Contexte** | E/S disque en direct |
| **Commande type** | `sudo fs_usage -w -f filesys` |

## Rôle

Trace en temps réel les accès au système de fichiers (diagnostic d'E/S).

## Options

| Option | Rôle |
| --- | --- |
| `-w` | format large (colonnes complètes) |
| `-f filesys` | filtre sur les opérations de système de fichiers |
| `-f network` | filtre sur le réseau |
| `‹process›` | limite à un processus |

## Exemples

**Suivre les accès disque**

```zsh
sudo fs_usage -w -f filesys
```

**Un process précis**

```zsh
sudo fs_usage -w Safari
```

*Mots-clés : io disque fs_usage accès temps réel diagnostic performance*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

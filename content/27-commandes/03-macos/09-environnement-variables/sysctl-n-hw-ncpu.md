---
title: "sysctl -n hw.ncpu"
description: "macOS — sysctl -n hw.ncpu (Nombre de cœurs) : Affiche le nombre de cœurs logiques (l'équivalent de nproc sous macOS)."
tags: [macos, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Environnement & variables |
| **Contexte** | Nombre de cœurs |
| **Commande type** | `sysctl -n hw.ncpu` |

## Rôle

Affiche le nombre de cœurs logiques (l'équivalent de nproc sous macOS).

## Options

| Option | Rôle |
| --- | --- |
| `hw.ncpu` | cœurs logiques (avec Hyper-Threading) |
| `hw.physicalcpu` | cœurs physiques |

## Exemples

**Nombre de cœurs**

```zsh
sysctl -n hw.ncpu
```

**Paralléliser make**

```zsh
make -j$(sysctl -n hw.ncpu)
```

**Cœurs physiques**

```zsh
sysctl -n hw.physicalcpu
```

*Mots-clés : coeurs cpu nproc sysctl parallélisme processeurs*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

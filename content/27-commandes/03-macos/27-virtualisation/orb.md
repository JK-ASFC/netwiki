---
title: "orb"
description: "macOS — orb (Machines Linux / Shell & commandes) : Ouvre un shell dans une machine Linux OrbStack, ou exécute une commande Linux depuis macOS. Sans argument, ouvre le shell de la machine par défaut."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | Machines Linux / Shell & commandes |
| **Commande type** | `orb uname -a` |

## Rôle

Ouvre un shell dans une machine Linux OrbStack, ou exécute une commande Linux depuis macOS. Sans argument, ouvre le shell de la machine par défaut.

## Options

| Option | Rôle |
| --- | --- |
| `-m ‹machine›` | machine cible (sinon la machine par défaut) |
| `-u ‹utilisateur›` | utilisateur Linux, par exemple root |
| `(sans argument) orb` | shell dans la machine par défaut |
| `(commande) orb uname -a` | exécute la commande dans Linux |
| `(mot de passe) orb sudo passwd $USER` | définit le mot de passe de l'utilisateur |
| `(variables) ORBENV=EDITOR:AWS_ACCESS_KEY_ID` | variables transmises à Linux |
| `(orbctl) orbctl shell ou orbctl run` | avec orbctl, le verbe est obligatoire |
| `(fichiers) /mnt/mac et ~/OrbStack` | partage de fichiers Mac et Linux |
| `(depuis Linux) mac ‹commande›` | exécute une commande macOS |

## Exemples

**Shell dans la machine par défaut**

```zsh
orb
```

**Commande dans une machine précise**

```zsh
orb -m ubuntu uname -a
```

**Shell root**

```zsh
orb -m ubuntu -u root
```

*Mots-clés : orbstack orb shell linux machine vm commande exécuter ssh*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

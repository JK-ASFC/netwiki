---
title: "orb (push pull)"
description: "macOS — orb (push pull) (Machines Linux / Transfert de fichiers) : Copie des fichiers du Mac vers une machine Linux (push) ou d'une machine Linux vers le Mac (pull)."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | Machines Linux / Transfert de fichiers |
| **Commande type** | `orb push -m ubuntu ~/bar.txt /home/jean/code/` |

## Rôle

Copie des fichiers du Mac vers une machine Linux (push) ou d'une machine Linux vers le Mac (pull).

## Options

| Option | Rôle |
| --- | --- |
| `push / pull` | push : Mac vers Linux, pull : Linux vers Mac |
| `-m ‹machine›` | machine concernée (sinon la machine par défaut) |
| `‹fichier›` | fichier à copier, sans destination |
| `‹fichier› ‹destination›` | fichier à copier et chemin d'arrivée |

## Exemples

**Envoyer un fichier à la machine par défaut**

```zsh
orb push ~/bar.txt
```

**Vers une machine et un dossier**

```zsh
orb push -m my-machine ~/bar.txt /home/my-user/code/
```

**Récupérer un fichier**

```zsh
orb pull ~/foo.txt
```

*Mots-clés : orbstack orb push pull copier fichier transfert machine linux mac*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

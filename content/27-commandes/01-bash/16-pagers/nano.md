---
title: "nano"
description: "Bash — nano (Éditeur simple) : Éditeur de texte en console le plus simple : les raccourcis sont rappelés en bas de l'écran (^ = Ctrl). Idéal pour éditer vite un fichier de config."
tags: [bash, commande, pagers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Pagers |
| **Contexte** | Éditeur simple |
| **Commande type** | `nano fichier` |

## Rôle

Éditeur de texte en console le plus simple : les raccourcis sont rappelés en bas de l'écran (^ = Ctrl). Idéal pour éditer vite un fichier de config.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | affiche les numéros de ligne |
| `-w` | désactive le retour à la ligne automatique (config) |
| `-m` | active la souris |
| `-i` | indentation automatique des nouvelles lignes |
| `-B` | crée une sauvegarde (~) à l'enregistrement |

## Exemples

**Éditer un fichier de config**

```bash
nano /etc/nextdns.conf
```

**Ouvrir directement à une ligne**

```bash
nano +12 script.sh
```

**Sans retour à la ligne auto**

```bash
nano -w nginx.conf
```

## Dans les autres shells

- [[27-commandes/03-macos/16-pagers/nano|nano (macOS)]]

*Mots-clés : nano éditeur texte console fichier modifier ctrl simple débutant pico pager*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

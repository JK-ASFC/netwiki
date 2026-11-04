---
title: "xargs"
description: "macOS — xargs (Construire des commandes) : Transforme l'entrée standard en arguments d'une commande (souvent après find ou grep)."
tags: [macos, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Recherche |
| **Contexte** | Construire des commandes |
| **Commande type** | `xargs` |

## Rôle

Transforme l'entrée standard en arguments d'une commande (souvent après find ou grep).

## Options

| Option | Rôle |
| --- | --- |
| `-I ‹{}›` | définit un jeton (souvent {}) remplacé par chaque ligne reçue |
| `-n ‹N›` | N arguments par exécution |
| `-0` | entrées séparées par des zéros (avec find -print0) |
| `-P ‹N›` | exécute N commandes en parallèle |

## Exemples

**Supprimer les fichiers trouvés**

```zsh
find . -name '*.tmp' | xargs rm
```

**Sûr (espaces)**

```zsh
find . -name '*.log' -print0 | xargs -0 gzip
```

**Un par un**

```zsh
ls *.txt | xargs -I {} cp {} /backup/
```

## Dans les autres shells

- [[27-commandes/01-bash/20-recherche/xargs|xargs (Bash)]]

*Mots-clés : xargs arguments construire find pipe parallèle batch placeholder*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

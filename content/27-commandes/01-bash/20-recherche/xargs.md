---
title: "xargs"
description: "Bash — xargs (Construire des commandes) : Transforme l'entrée standard en arguments d'une commande (souvent après find ou grep)."
tags: [bash, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
find . -name '*.tmp' | xargs rm
```

**Sûr (espaces)**

```bash
find . -name '*.log' -print0 | xargs -0 gzip
```

**Un par un**

```bash
ls *.txt | xargs -I {} cp {} /backup/
```

## Dans les autres shells

- [[27-commandes/03-macos/21-recherche/xargs|xargs (macOS)]]

*Mots-clés : xargs arguments construire find pipe parallèle batch placeholder*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

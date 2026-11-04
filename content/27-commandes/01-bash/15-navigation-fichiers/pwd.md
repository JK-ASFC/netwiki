---
title: "pwd"
description: "Bash — pwd (Navigation / Répertoires) : Affiche le répertoire de travail courant."
tags: [bash, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Navigation / Répertoires |
| **Commande type** | `pwd` |

## Rôle

Affiche le répertoire de travail courant.

## En détail

Affiche le chemin du dossier ou vous vous trouvez. Le réflexe pour répondre à la question 'je suis ou la ?'.

## Options

| Option | Rôle |
| --- | --- |
| `-P` | résout les liens symboliques |
| `(sans arg)` | chemin courant |

## Exemples

**Ou suis-je**

```bash
pwd
```

**Chemin réel**

```bash
pwd -P
```

**Via variable**

```bash
echo "$PWD"
```

## Dans les autres shells

- [[27-commandes/03-macos/15-navigation-fichiers/pwd|pwd (macOS)]]

*Mots-clés : répertoire courant chemin afficher pwd*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

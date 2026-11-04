---
title: "make"
description: "macOS — make (Compilation) : Compile un logiciel depuis ses sources en suivant un Makefile."
tags: [macos, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | Compilation |
| **Commande type** | `make` |

## Rôle

Compile un logiciel depuis ses sources en suivant un Makefile.

## En détail

Compile et installe un logiciel à partir de son code source en suivant un Makefile (la recette de construction). Le trio classique est ./configure (prépare), make (compile) puis sudo make install (installe). make ne refait que le travail nécessaire.

## Options

| Option | Rôle |
| --- | --- |
| `(sans arg)` | exécute la cible par défaut du Makefile |
| `‹cible›` | exécute une cible précise |
| `-j ‹N›` | compile en parallèle sur N cœurs |
| `install` | installe (souvent avec sudo) |
| `clean` | nettoie les fichiers de build |

## Exemples

**Compiler**

```zsh
make
```

**En parallèle**

```zsh
make -j$(sysctl -n hw.ncpu)
```

**Installer**

```zsh
sudo make install
```

## Dans les autres shells

- [[27-commandes/01-bash/17-paquets-mises-a-jour/make|make (Bash)]]

*Mots-clés : compiler make build makefile sources installer*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

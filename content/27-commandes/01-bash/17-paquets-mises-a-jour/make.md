---
title: "make"
description: "Bash — make (Compilation / source) : Automatise la compilation et l'installation d'un logiciel depuis ses sources en suivant les règles d'un Makefile ; ne recompile que ce qui a changé."
tags: [bash, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | Compilation / source |
| **Commande type** | `make` |

## Rôle

Automatise la compilation et l'installation d'un logiciel depuis ses sources en suivant les règles d'un Makefile ; ne recompile que ce qui a changé.

## En détail

Compile et installe un logiciel à partir de son code source en suivant un Makefile (la recette de construction). Le trio classique est ./configure (prépare), make (compile) puis sudo make install (installe). make ne refait que le travail nécessaire.

## Options

| Option | Rôle |
| --- | --- |
| `-j ‹N›` | compile en parallèle sur N cœurs (accélère fortement ; ex. -j$(nproc)) |
| `-C ‹dossier›` | lance make depuis un autre dossier |
| `-f ‹Makefile›` | utilise un fichier de règles nommé autrement |
| `-n` | simulation : affiche les commandes sans les exécuter |
| `-B` | force la reconstruction de toutes les cibles |
| `clean` | cible standard : supprime les fichiers générés par la compilation |
| `install` | cible standard : installe les binaires compilés (souvent sudo make install) |

## Exemples

**Depuis les sources**

```bash
./configure && make && sudo make install
```

**Compiler en parallèle**

```bash
make -j$(nproc)
```

**Nettoyer**

```bash
make clean
```

## Dans les autres shells

- [[27-commandes/03-macos/17-paquets-mises-a-jour/make|make (macOS)]]

*Mots-clés : make compiler compilation build makefile installer sources depuis source cible target parallèle nproc configure*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

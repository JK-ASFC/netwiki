---
title: "grep"
description: "Bash — grep (Analyse de logs) : Filtre des lignes par motif/regex."
tags: [bash, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Recherche |
| **Contexte** | Analyse de logs |
| **Commande type** | `grep -rni "motif" .` |

## Rôle

Filtre des lignes par motif/regex.

## En détail

Cherche un texte ou un motif dans des fichiers et affiche les lignes qui correspondent. L'outil de recherche de texte par excellence.

## Options

| Option | Rôle |
| --- | --- |
| `-r` | récursif |
| `-n` | numéro de ligne |
| `-i` | insensible casse |
| `-v` | inverse |
| `-c` | compte |
| `-E` | regex étendue |
| `-A/-B/-C N` | contexte |
| `--color=‹auto›` | colore les correspondances (auto, always ou never) |
| `-w` | ne correspond qu'aux mots entiers |
| `-o` | n'affiche que la partie qui correspond (pas toute la ligne) |

## Exemples

**Récursif insensible**

```bash
grep -rni "todo" ./src
```

**Compter les erreurs**

```bash
grep -c "error" app.log
```

## Dans les autres shells

- [[27-commandes/03-macos/21-recherche/grep|grep (macOS)]]

*Mots-clés : chercher texte motif filtrer recherche regex pattern grep contenu*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

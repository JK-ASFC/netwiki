---
title: "mv"
description: "macOS — mv (Fichiers / Déplacement) : Déplace ou renomme fichiers et dossiers."
tags: [macos, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Déplacement |
| **Commande type** | `mv ancien.txt nouveau.txt` |

## Rôle

Déplace ou renomme fichiers et dossiers.

## En détail

Déplace un fichier ou un dossier ailleurs, ou le renommé si la destination est dans le même dossier.

## Options

| Option | Rôle |
| --- | --- |
| `-i` | demande avant d'écraser |
| `-n` | n'écrase jamais |
| `-v` | verbeux |
| `(meme dossier)` | renomme |

## Exemples

**Renommer**

```zsh
mv ancien.txt nouveau.txt
```

**Déplacer**

```zsh
mv rapport.pdf /srv/docs/
```

**Sans écraser**

```zsh
mv -n a.txt b.txt
```

## Dans les autres shells

- [[27-commandes/01-bash/15-navigation-fichiers/mv|mv (Bash)]]

*Mots-clés : déplacer renommer fichier dossier mv*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

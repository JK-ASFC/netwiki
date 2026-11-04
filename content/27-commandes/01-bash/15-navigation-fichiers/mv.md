---
title: "mv"
description: "Bash — mv (Fichiers / Déplacement) : Déplace ou renomme fichiers et dossiers."
tags: [bash, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
mv ancien.txt nouveau.txt
```

**Déplacer**

```bash
mv rapport.pdf /srv/docs/
```

**Sans écraser**

```bash
mv -n a.txt b.txt
```

## Dans les autres shells

- [[27-commandes/03-macos/15-navigation-fichiers/mv|mv (macOS)]]

*Mots-clés : déplacer renommer fichier dossier mv*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

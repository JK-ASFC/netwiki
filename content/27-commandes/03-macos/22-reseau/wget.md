---
title: "wget"
description: "macOS — wget (Téléchargement) : Télécharge des fichiers depuis le web (à installer : brew install wget)."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Téléchargement |
| **Commande type** | `wget https://example.com/f.zip` |

## Rôle

Télécharge des fichiers depuis le web (à installer : brew install wget).

## En détail

Télécharge des fichiers depuis le web, y compris des sites entiers en récursif. Plus oriente téléchargement que curl.

## Options

| Option | Rôle |
| --- | --- |
| `-O ‹fichier›` | nom de sortie |
| `-c` | reprend un téléchargement interrompu |
| `-r` | récursif (site entier) |
| `-q` | silencieux |
| `--limit-rate= ‹500k›` | bridé le débit |

## Exemples

**Télécharger**

```zsh
wget https://example.com/f.zip
```

**Reprendre**

```zsh
wget -c https://example.com/gros.iso
```

## Dans les autres shells

- [[27-commandes/01-bash/21-reseau/wget|wget (Bash)]]

*Mots-clés : télécharger wget download web récursif brew miroir*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

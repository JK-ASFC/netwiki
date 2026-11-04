---
title: "cp"
description: "macOS — cp (Fichiers / Copie) : Copie fichiers et répertoires."
tags: [macos, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Copie |
| **Commande type** | `cp -r dossier/ /backup/` |

## Rôle

Copie fichiers et répertoires.

## En détail

Copie un fichier ou un dossier vers un autre endroit. L'original reste en place.

## Options

| Option | Rôle |
| --- | --- |
| `-r` | récursif (dossiers) |
| `-p` | préserve droits et dates |
| `-a` | archive (r + p + liens) |
| `-i` | demande avant d'écraser |
| `--parents` | conserve toute l'arborescence du chemin source (cp --parents a/b/c /dest crée /dest/a/b/c) |

## Exemples

**Un fichier**

```zsh
cp fichier.txt /tmp/
```

**Un dossier**

```zsh
cp -r dossier/ /backup/
```

**Avec attributs**

```zsh
cp -a /etc/nginx /backup/nginx
```

## Dans les autres shells

- [[27-commandes/01-bash/15-navigation-fichiers/cp|cp (Bash)]]

*Mots-clés : copier fichier dossier sauvegarde cp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

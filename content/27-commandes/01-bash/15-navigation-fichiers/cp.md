---
title: "cp"
description: "Bash — cp (Fichiers / Copie) : Copie fichiers et répertoires."
tags: [bash, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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
| `-t ‹dossier›` | place la destination EN PREMIER, avant les sources (coreutils GNU) |

## Exemples

**Un fichier**

```bash
cp fichier.txt /tmp/
```

**Un dossier**

```bash
cp -r dossier/ /backup/
```

**Avec attributs**

```bash
cp -a /etc/nginx /backup/nginx
```

## Dans les autres shells

- [[27-commandes/03-macos/15-navigation-fichiers/cp|cp (macOS)]]

*Mots-clés : copier fichier dossier sauvegarde cp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

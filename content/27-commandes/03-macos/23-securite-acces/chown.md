---
title: "chown"
description: "macOS — chown (Propriétaire) : Change le propriétaire (et éventuellement le groupe) d'un fichier."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Propriétaire |
| **Commande type** | `sudo chown jean fichier` |

## Rôle

Change le propriétaire (et éventuellement le groupe) d'un fichier.

## En détail

Change le propriétaire (et éventuellement le groupe) d'un fichier. Sert à confier un fichier au bon utilisateur.

## Options

| Option | Rôle |
| --- | --- |
| `‹utilisateur›` | change le propriétaire |
| `‹utilisateur:groupe›` | change propriétaire et groupe |
| `-R` | récursif |

## Exemples

**Changer le propriétaire**

```zsh
sudo chown jean fichier.txt
```

**Propriétaire et groupe**

```zsh
sudo chown jean:staff dossier/
```

**Récursif**

```zsh
sudo chown -R jean site/
```

## Dans les autres shells

- [[27-commandes/01-bash/22-securite-acces/chown|chown (Bash)]]

*Mots-clés : propriétaire groupe chown changer possession fichier*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

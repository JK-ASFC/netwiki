---
title: "ls -le"
description: "macOS — ls -le (Voir les ACL) : Affiche les permissions étendues (ACL) d'un fichier, en plus des droits classiques."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Voir les ACL |
| **Commande type** | `ls -le fichier` |

## Rôle

Affiche les permissions étendues (ACL) d'un fichier, en plus des droits classiques.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | format long (droits classiques) |
| `-e` | ajoute les entrées ACL |
| `-O` | affiche les indicateurs de fichier (flags) |
| `-@` | affiche les attributs étendus (xattr) |

## Exemples

**Droits + ACL**

```zsh
ls -le dossier
```

**Avec les flags**

```zsh
ls -lO fichier
```

**Attributs étendus**

```zsh
ls -l@ telechargement.dmg
```

*Mots-clés : acl permissions étendues ls droits liste finder*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

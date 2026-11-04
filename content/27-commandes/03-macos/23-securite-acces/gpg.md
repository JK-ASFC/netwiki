---
title: "gpg"
description: "macOS — gpg (Chiffrement GPG) : Chiffre, déchiffre et signe des fichiers (brew install gnupg)."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Chiffrement GPG |
| **Commande type** | `gpg --verify fichier.sig fichier` |

## Rôle

Chiffre, déchiffre et signe des fichiers (brew install gnupg).

## En détail

Chiffre et signe des fichiers ou des messages avec une paire de clés. Sert à protéger des données ou à vérifier l'authenticité d'un fichier.

## Options

| Option | Rôle |
| --- | --- |
| `--verify ‹sig fichier›` | vérifie une signature |
| `-c ‹fichier›` | chiffre avec un mot de passe (symétrique) |
| `-d ‹fichier.gpg›` | déchiffre |
| `--gen-key` | génère une paire de clés |
| `--import ‹clé.asc›` | importe une clé publique |

## Exemples

**Vérifier une signature**

```zsh
gpg --verify image.iso.sig image.iso
```

**Chiffrer un fichier**

```zsh
gpg -c secret.txt
```

**Déchiffrer**

```zsh
gpg -d secret.txt.gpg
```

## Dans les autres shells

- [[27-commandes/01-bash/22-securite-acces/gpg|gpg (Bash)]]

*Mots-clés : gpg chiffrement signature clé vérifier déchiffrer brew gnupg*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

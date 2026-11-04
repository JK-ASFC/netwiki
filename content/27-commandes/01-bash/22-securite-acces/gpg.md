---
title: "gpg"
description: "Bash — gpg (Cryptographie / PKI) : Chiffrement et signature (vérifier des paquets)."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Cryptographie / PKI |
| **Commande type** | `gpg --verify fichier.sig` |

## Rôle

Chiffrement et signature (vérifier des paquets).

## En détail

Chiffre et signe des fichiers ou des messages avec une paire de clés. Sert à protéger des données ou à vérifier l'authenticité d'un fichier.

## Options

| Option | Rôle |
| --- | --- |
| `-e -r ‹destinataire›` | chiffre pour un destinataire |
| `-d` | déchiffre |
| `--sign` | signe |
| `--verify` | vérifie |
| `--armor` | sortie ASCII |

## Exemples

**Vérifier une signature**

```bash
gpg --verify image.iso.sig image.iso
```

**Chiffrer pour qqn**

```bash
gpg -e -r alice@dom rapport.pdf
```

## Dans les autres shells

- [[27-commandes/03-macos/23-securite-acces/gpg|gpg (macOS)]]

*Mots-clés : chiffrement signature clé pgp déchiffrer vérifier gpg*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

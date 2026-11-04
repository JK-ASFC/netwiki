---
title: "passwd"
description: "macOS — passwd (Mot de passe) : Change le mot de passe d'un compte local."
tags: [macos, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Mot de passe |
| **Commande type** | `passwd` |

## Rôle

Change le mot de passe d'un compte local.

## En détail

Change le mot de passe d'un compte. Sans argument, change le votre ; avec un nom (en admin), celui d'un autre utilisateur.

## Options

| Option | Rôle |
| --- | --- |
| `(sans arg)` | change votre mot de passe |
| `‹utilisateur›` | change celui d'un autre compte (admin) |

## Exemples

**Changer le mien**

```zsh
passwd
```

**Celui d'un autre**

```zsh
sudo passwd jean
```

## Dans les autres shells

- [[27-commandes/01-bash/06-comptes-utilisateurs/passwd|passwd (Bash)]]

*Mots-clés : mot de passe passwd changer utilisateur sécurité*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

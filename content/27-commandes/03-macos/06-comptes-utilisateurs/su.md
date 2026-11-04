---
title: "su"
description: "macOS — su (Changer d'utilisateur) : Ouvre une session sous un autre utilisateur (root est désactivé par défaut sur macOS)."
tags: [macos, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Changer d'utilisateur |
| **Commande type** | `su - jean` |

## Rôle

Ouvre une session sous un autre utilisateur (root est désactivé par défaut sur macOS).

## En détail

Change d'utilisateur dans le terminal, souvent pour devenir root. su - ouvre une session propre comme si on s'était connecte.

## Options

| Option | Rôle |
| --- | --- |
| `- ‹utilisateur›` | session propre (recharge l'environnement) |
| `‹utilisateur›` | change d'utilisateur sans recharger l'environnement |

## Exemples

**Devenir un autre compte**

```zsh
su - jean
```

**Note**

```zsh
Sur macOS, préférez sudo ; le compte root est verrouillé par défaut
```

## Dans les autres shells

- [[27-commandes/01-bash/06-comptes-utilisateurs/su|su (Bash)]]

*Mots-clés : su utilisateur root session changer identité*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

---
title: "passwd"
description: "Bash — passwd (Comptes / Mot de passe) : Définit ou change un mot de passe."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Mot de passe |
| **Commande type** | `passwd jdupont` |

## Rôle

Définit ou change un mot de passe.

## En détail

Change le mot de passe d'un compte. Sans argument, change le votre ; avec un nom (en admin), celui d'un autre utilisateur.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | verrouille le mot de passe |
| `-e` | force le changement à la prochaine connexion |
| `-S` | état du mot de passe |
| `-d` | supprime le mot de passe |

## Exemples

**Changer le sien**

```bash
passwd
```

**Pour un autre (root)**

```bash
passwd jdupont
```

**Forcer le renouvellement**

```bash
passwd -e jdupont
```

## Dans les autres shells

- [[27-commandes/03-macos/06-comptes-utilisateurs/passwd|passwd (macOS)]]

*Mots-clés : mot de passe changer expirer verrouiller passwd*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

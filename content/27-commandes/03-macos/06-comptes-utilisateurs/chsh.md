---
title: "chsh"
description: "macOS — chsh (Shell par défaut) : Change le shell de connexion de l'utilisateur (zsh par défaut depuis macOS Catalina)."
tags: [macos, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Shell par défaut |
| **Commande type** | `chsh -s /bin/zsh` |

## Rôle

Change le shell de connexion de l'utilisateur (zsh par défaut depuis macOS Catalina).

## Options

| Option | Rôle |
| --- | --- |
| `-s ‹chemin_shell›` | définit le shell (doit figurer dans /etc/shells) |

## Exemples

**Passer à zsh**

```zsh
chsh -s /bin/zsh
```

**Voir les shells autorisés**

```zsh
cat /etc/shells
```

*Mots-clés : shell zsh bash chsh changer connexion login*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

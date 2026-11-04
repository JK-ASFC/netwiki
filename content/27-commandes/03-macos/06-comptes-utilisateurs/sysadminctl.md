---
title: "sysadminctl"
description: "macOS — sysadminctl (Gestion des comptes) : Crée, supprime et administre des comptes utilisateurs (outil moderne recommandé)."
tags: [macos, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Gestion des comptes |
| **Commande type** | `sysadminctl -addUser jean -fullName "Jean" -password -` |

## Rôle

Crée, supprime et administre des comptes utilisateurs (outil moderne recommandé).

## Options

| Option | Rôle |
| --- | --- |
| `-addUser ‹nom›` | crée un utilisateur |
| `-fullName ‹'Nom Complet'›` | nom affiché |
| `-password ‹mdp›` | mot de passe (- pour saisie interactive) |
| `-admin` | fait du compte un administrateur |
| `-deleteUser ‹nom›` | supprime un utilisateur |
| `-secureTokenStatus ‹nom›` | état du SecureToken (nécessaire pour FileVault) |
| `-newPassword ‹mdp› -oldPassword ‹ancien›` | change un mot de passe |

## Exemples

**Créer un admin**

```zsh
sudo sysadminctl -addUser jean -fullName "Jean Dupont" -password - -admin
```

**Supprimer**

```zsh
sudo sysadminctl -deleteUser jean
```

**État SecureToken**

```zsh
sysadminctl -secureTokenStatus dexter
```

*Mots-clés : utilisateur compte créer supprimer sysadminctl admin mot de passe*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

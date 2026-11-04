---
title: "security"
description: "macOS — security (Trousseau (Keychain)) : Gère le trousseau macOS : mots de passe, certificats, clés, depuis la ligne de commande."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Trousseau (Keychain) |
| **Commande type** | `security find-generic-password -s service` |

## Rôle

Gère le trousseau macOS : mots de passe, certificats, clés, depuis la ligne de commande.

## Options

| Option | Rôle |
| --- | --- |
| `find-generic-password -s ‹service›` | cherche un mot de passe enregistré |
| `find-generic-password -s ‹service› -w` | affiche uniquement le mot de passe |
| `add-generic-password -s ‹service› -a ‹compte› -w ‹mdp›` | ajoute un secret |
| `delete-generic-password -s ‹service›` | supprime un secret |
| `list-keychains` | liste les trousseaux |
| `unlock-keychain` | déverrouille le trousseau |

## Exemples

**Récupérer un mot de passe**

```zsh
security find-generic-password -s github -w
```

**Ajouter un secret**

```zsh
security add-generic-password -s api-prod -a dexter -w 'jeton'
```

**Lister les trousseaux**

```zsh
security list-keychains
```

*Mots-clés : trousseau keychain security mot de passe certificat clé secret*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

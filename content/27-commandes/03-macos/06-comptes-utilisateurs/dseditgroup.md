---
title: "dseditgroup"
description: "macOS — dseditgroup (Groupes) : Crée, modifie et gère l'appartenance aux groupes locaux."
tags: [macos, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Groupes |
| **Commande type** | `dseditgroup -o edit -a jean -t user admin` |

## Rôle

Crée, modifie et gère l'appartenance aux groupes locaux.

## Options

| Option | Rôle |
| --- | --- |
| `-o edit -a ‹user› -t user ‹groupe›` | ajoute un utilisateur à un groupe |
| `-o edit -d ‹user› -t user ‹groupe›` | retire un utilisateur |
| `-o checkmember -m ‹user› ‹groupe›` | vérifie l'appartenance |
| `-o create ‹groupe›` | crée un groupe |
| `-o delete ‹groupe›` | supprime un groupe |

## Exemples

**Donner les droits admin**

```zsh
sudo dseditgroup -o edit -a jean -t user admin
```

**Retirer d'un groupe**

```zsh
sudo dseditgroup -o edit -d jean -t user admin
```

**Vérifier**

```zsh
dseditgroup -o checkmember -m jean admin
```

*Mots-clés : groupe membre dseditgroup ajouter retirer admin*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

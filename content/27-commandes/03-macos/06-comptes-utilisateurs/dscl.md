---
title: "dscl"
description: "macOS — dscl (Annuaire local (Open Directory)) : Interroge et modifie la base de comptes locale (l'équivalent macOS de /etc/passwd, via Directory Service)."
tags: [macos, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Annuaire local (Open Directory) |
| **Commande type** | `dscl . -list /Users` |

## Rôle

Interroge et modifie la base de comptes locale (l'équivalent macOS de /etc/passwd, via Directory Service).

## Options

| Option | Rôle |
| --- | --- |
| `. -list /Users` | liste les utilisateurs locaux |
| `. -list /Groups` | liste les groupes |
| `. -read /Users/‹nom›` | affiche les attributs d'un utilisateur |
| `. -read /Users/‹nom› UniqueID` | lit l'UID d'un compte |
| `. -create /Users/‹nom›` | crée un enregistrement utilisateur |
| `. -append /Groups/‹groupe› GroupMembership ‹user›` | ajoute un membre à un groupe |
| `. -delete /Users/‹nom›` | supprime un utilisateur |

## Exemples

**Lister les comptes**

```zsh
dscl . -list /Users | grep -v '^_'
```

**Voir un compte**

```zsh
dscl . -read /Users/dexter
```

**Groupes d'un utilisateur**

```zsh
id -Gn dexter
```

*Mots-clés : utilisateur compte annuaire dscl directory service open groupe uid*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

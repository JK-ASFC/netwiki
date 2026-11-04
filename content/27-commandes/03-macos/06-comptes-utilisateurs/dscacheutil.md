---
title: "dscacheutil"
description: "macOS — dscacheutil (Cache d'annuaire) : Interroge le cache du service d'annuaire (comptes, groupes, hôtes) et le vide."
tags: [macos, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Cache d'annuaire |
| **Commande type** | `dscacheutil -q user -a name jean` |

## Rôle

Interroge le cache du service d'annuaire (comptes, groupes, hôtes) et le vide.

## Options

| Option | Rôle |
| --- | --- |
| `-q user -a name ‹nom›` | cherche un utilisateur (comme getent passwd) |
| `-q group -a name ‹nom›` | cherche un groupe |
| `-q host -a name ‹nom›` | résolution de nom |
| `-flushcache` | vide le cache d'annuaire et DNS |

## Exemples

**Chercher un compte**

```zsh
dscacheutil -q user -a name jean
```

**Vider le cache DNS**

```zsh
sudo dscacheutil -flushcache
```

## Dans les autres shells

- [[27-commandes/03-macos/22-reseau/dscacheutil|dscacheutil (macOS)]]

*Mots-clés : cache annuaire dscacheutil utilisateur groupe hôte flush getent*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

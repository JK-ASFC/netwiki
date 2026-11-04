---
title: "orb list"
description: "macOS — orb list (Machines Linux / Inventaire) : Liste les machines Linux d'OrbStack. Les sous-commandes info, default, logs, rename et ssh servent à les examiner et à les désigner."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | Machines Linux / Inventaire |
| **Commande type** | `orb list` |

## Rôle

Liste les machines Linux d'OrbStack. Les sous-commandes info, default, logs, rename et ssh servent à les examiner et à les désigner.

## Options

| Option | Rôle |
| --- | --- |
| `-q` | noms seulement, un par ligne |
| `(détails) orb info ‹machine›` | informations sur une machine |
| `(défaut) orb default ‹machine›` | lit ou fixe la machine par défaut |
| `(journaux) orb logs ‹machine›` | journaux de démarrage et console |
| `(renommer) orb rename` | renomme une machine |
| `(ssh) orb ssh` | détails de connexion SSH |

## Exemples

**Lister les machines**

```zsh
orb list
```

**Noms seulement (scripts)**

```zsh
orb list -q
```

**Changer la machine par défaut**

```zsh
orb default ubuntu
```

*Mots-clés : orbstack orb list machines inventaire info default logs rename ssh*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

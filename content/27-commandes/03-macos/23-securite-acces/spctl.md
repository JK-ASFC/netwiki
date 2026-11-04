---
title: "spctl"
description: "macOS — spctl (Gatekeeper) : Contrôle Gatekeeper, la vérification des applications signées et notariées."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Gatekeeper |
| **Commande type** | `spctl --status` |

## Rôle

Contrôle Gatekeeper, la vérification des applications signées et notariées.

## Options

| Option | Rôle |
| --- | --- |
| `--status` | état de Gatekeeper (activé ou non) |
| `--assess ‹app›` | évalue si une app serait autorisée |
| `-a -v ‹app.app›` | vérifie la signature d'une application |
| `--add ‹app›` | ajoute une exception |
| `--master-disable` | désactive Gatekeeper (déconseillé) |

## Exemples

**État**

```zsh
spctl --status
```

**Vérifier une app**

```zsh
spctl -a -vv /Applications/MonApp.app
```

*Mots-clés : gatekeeper spctl signature notarisation sécurité application quarantaine*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

---
title: "netstat"
description: "macOS — netstat (Connexions & routes) : Affiche la table de routage et les connexions (version BSD)."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Connexions & routes |
| **Commande type** | `netstat -rn` |

## Rôle

Affiche la table de routage et les connexions (version BSD).

## En détail

Affiche les connexions réseau et les ports en écoute (outil classique). ss est son remplaçant plus rapide.

## Options

| Option | Rôle |
| --- | --- |
| `-rn` | table de routage (numérique) |
| `-an` | toutes les connexions (numérique) |
| `-p tcp` | filtre le protocole TCP |
| `-i` | statistiques par interface |
| `-s` | statistiques par protocole |

## Exemples

**Table de routage**

```zsh
netstat -rn
```

**Connexions TCP**

```zsh
netstat -an -p tcp
```

**Passerelle par défaut**

```zsh
netstat -rn | grep default
```

## Dans les autres shells

- [[27-commandes/01-bash/21-reseau/netstat|netstat (Bash)]]
- [[27-commandes/02-powershell/23-reseau/netstat|netstat (PowerShell)]]

*Mots-clés : réseau connexions routes netstat ports table routage*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

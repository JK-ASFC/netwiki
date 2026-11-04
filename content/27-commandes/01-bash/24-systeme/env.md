---
title: "env"
description: "Bash — env (Configuration d'environnement) : Affiche ou définit les variables d'environnement."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Configuration d'environnement |
| **Commande type** | `env` |

## Rôle

Affiche ou définit les variables d'environnement.

## En détail

Affiche les variables d'environnement : des réglages que les programmes lisent (chemin des commandes, langue, dossier personnel). Sert aussi à lancer une commande avec des variables modifiées.

## Options

| Option | Rôle |
| --- | --- |
| `(seul)` | liste les variables |
| `VAR=val cmd` | variable ponctuelle |
| `-i` | environnement vide |
| `-u ‹variable›` | retire une variable |

## Exemples

**Voir l'environnement**

```bash
env | sort
```

**Lancer avec un fuseau**

```bash
env TZ=UTC date
```

*Mots-clés : variable environnement export shell PATH env contexte*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

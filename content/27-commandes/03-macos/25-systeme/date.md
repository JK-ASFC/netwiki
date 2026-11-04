---
title: "date"
description: "macOS — date (Heure & date) : Affiche ou règle la date (version BSD, syntaxe -v pour les calculs)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Heure & date |
| **Commande type** | `date` |

## Rôle

Affiche ou règle la date (version BSD, syntaxe -v pour les calculs).

## Options

| Option | Rôle |
| --- | --- |
| `+‹format›` | format personnalisé (ex. +%Y-%m-%d) |
| `-u` | heure universelle (UTC) |
| `-r ‹epoch›` | convertit un timestamp Unix en date |
| `-v ‹-1d›` | calcul de date : -1d (hier), +1m (dans un mois) |
| `-j -f ‹format valeur›` | interprète une date sans changer l'horloge |

## Exemples

**Format ISO**

```zsh
date +%Y-%m-%d
```

**Hier (BSD)**

```zsh
date -v-1d +%Y-%m-%d
```

**Depuis un timestamp**

```zsh
date -r 1700000000
```

## Dans les autres shells

- [[27-commandes/01-bash/24-systeme/date|date (Bash)]]

*Mots-clés : date heure horloge fuseau date bsd calcul*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

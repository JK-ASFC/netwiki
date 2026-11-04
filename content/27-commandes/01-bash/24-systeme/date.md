---
title: "date"
description: "Bash — date (Date & heure) : Affiche ou règle la date et l'heure du système."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Date & heure |
| **Commande type** | `date` |

## Rôle

Affiche ou règle la date et l'heure du système.

## Options

| Option | Rôle |
| --- | --- |
| `-u` | affiche l'heure UTC |
| `-d ‹expression›` | analyse une date précise ou relative (ex : "2026-12-31", "now", "2 days ago", "next friday") |
| `-I` | format ISO 8601 (AAAA-MM-JJ) |
| `-R` | format RFC 2822 (en-tête mail) |

## Exemples

**Maintenant**

```bash
date
```

**Format AAAA-MM-JJ**

```bash
date +%Y-%m-%d
```

**Il y a 7 jours**

```bash
date -d "7 days ago"
```

## Dans les autres shells

- [[27-commandes/03-macos/25-systeme/date|date (macOS)]]

*Mots-clés : date heure horloge timestamp format système jour*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*

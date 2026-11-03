---
title: "Unités de mesure du fichier de configuration"
description: "Nginx — Unités de mesure du fichier de configuration. nginx prend en charge plusieurs unités de mesure pour indiquer des tailles, des décalages et des intervalles de temps dans les fichiers de configuration."
tags: [nginx, guide]
icon: book-open
---

nginx prend en charge plusieurs unités de mesure pour indiquer des tailles, des décalages et des intervalles de temps dans les fichiers de configuration.

## Tailles et décalages

Les tailles peuvent s'exprimer en octets, kilooctets ou mégaoctets avec les suffixes suivants :

- `k` et `K` pour les kilooctets
- `m` et `M` pour les mégaoctets

Par exemple, « `1024` », « `8k` », « `1m` ».

Les décalages peuvent aussi s'exprimer en gigaoctets avec les suffixes `g` ou `G`.

## Intervalles de temps

Les intervalles de temps peuvent s'exprimer en millisecondes, secondes, minutes, heures, jours, etc., avec les suffixes suivants :

|   |   |
| --- | --- |
| ms | millisecondes |
| s | secondes (par défaut) |
| m | minutes |
| h | heures |
| d | jours |
| w | semaines |
| M | mois, 30 jours |
| y | années, 365 jours |

Plusieurs unités peuvent être combinées dans une même valeur, de la plus grande à la plus petite, éventuellement séparées par des espaces. Par exemple, « `1h 30m` » représente la même durée que « `90m` » ou « `5400s` ».

- Une valeur sans suffixe s'exprime en secondes.
- Il est recommandé de toujours indiquer un suffixe.
- Certains intervalles de temps ne peuvent être indiqués qu'à la seconde près.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

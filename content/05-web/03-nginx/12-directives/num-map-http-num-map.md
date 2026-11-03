---
title: "num_map (ngx_http_num_map_module)"
description: "Directive nginx num_map (ngx_http_num_map_module) — Describes how the values of the specified variable depend on numeric values or numeric value ranges. NOTE Since variables are evaluated only when used, the mere existence of even a large number of…"
tags: [nginx, directive, ngx_http_num_map_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `num_map [$number] $variable { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_num_map_module\|ngx_http_num_map_module]] |

## Utilisation

Describes how the values of the specified variable depend on numeric values or numeric value ranges.

> [!NOTE]
> Since variables are evaluated only when used, the mere existence of even a large number of declared “`num_map`” variables does not cause any extra costs for request processing.

Parameters inside the `num_map` block specify a mapping between source and resulting values.

Source values are specified as numbers or as numeric ranges.

Les paramètres spéciaux suivants sont aussi pris en charge :

- **`default`**

  définit la valeur résultante si la valeur source ne correspond à aucune des variantes indiquées. Sans `default`, la valeur résultante par défaut est une chaîne vide.

- **`include`**

  inclut un fichier de valeurs. Il peut y avoir plusieurs inclusions.

- **`volatile`**

  indicates that the variable is not cacheable.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

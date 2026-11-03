---
title: "num_map (ngx_stream_num_map_module)"
description: "Directive nginx num_map (ngx_stream_num_map_module) — Décrit la dépendance entre les valeurs de la variable indiquée et des valeurs ou plages de valeurs numériques. NOTE Since variables are evaluated only when used, the mere existence of even a large…"
tags: [nginx, directive, ngx_stream_num_map_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `num_map [$number] $variable { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_num_map_module\|ngx_stream_num_map_module]] |

## Utilisation

Décrit la dépendance entre les valeurs de la variable indiquée et des valeurs ou plages de valeurs numériques.

> [!NOTE]
> Since variables are evaluated only when used, the mere existence of even a large number of declared “`num_map`” variables does not cause any extra costs for connection processing.

Les paramètres du bloc `num_map` définissent la correspondance entre les valeurs sources et les valeurs résultantes.

Les valeurs sources sont des nombres ou des plages numériques.

Les paramètres spéciaux suivants sont aussi pris en charge :

- **`default`**

  définit la valeur résultante si la valeur source ne correspond à aucune des variantes indiquées. Sans `default`, la valeur résultante par défaut est une chaîne vide.

- **`include`**

  inclut un fichier de valeurs. Il peut y avoir plusieurs inclusions.

- **`volatile`**

  indique que la variable ne peut pas être mise en cache.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

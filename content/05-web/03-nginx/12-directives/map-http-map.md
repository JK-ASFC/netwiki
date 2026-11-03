---
title: "map (ngx_http_map_module)"
description: "Directive nginx map (ngx_http_map_module) — Crée une nouvelle variable dont la valeur dépend de celle d'une ou plusieurs variables sources indiquées dans le premier paramètre. NOTE Avant la version 0.9.0, une seule variable pouvait être…"
tags: [nginx, directive, ngx_http_map_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `map string $variable { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_map_module\|ngx_http_map_module]] |

## Utilisation

Crée une nouvelle variable dont la valeur dépend de celle d'une ou plusieurs variables sources indiquées dans le premier paramètre.

> [!NOTE]
> Avant la version 0.9.0, une seule variable pouvait être indiquée dans le premier paramètre.

> [!NOTE]
> Comme les variables ne sont évaluées que lorsqu'elles sont utilisées, la simple déclaration d'un grand nombre de variables « `map` » n'ajoute aucun coût au traitement des requêtes.

Les paramètres du bloc `map` définissent la correspondance entre les valeurs sources et les valeurs résultantes.

Les valeurs sources sont des chaînes ou des expressions régulières (0.9.6).

Les chaînes sont comparées sans tenir compte de la casse.

Une expression régulière commence soit par le symbole « `~` » pour une correspondance sensible à la casse, soit par « `~*` » (1.0.4) pour une correspondance insensible à la casse. Elle peut contenir des captures nommées et positionnelles, utilisables ensuite dans d'autres directives avec la variable résultante. Les expressions régulières sont évaluées lors de l'évaluation de la variable résultante, et une correspondance réussie remplace les captures positionnelles « `$1` »...« `$9` » définies par des expressions régulières précédentes ; voir [[10-guides/01-introduction/regex-captures|Captures des expressions régulières]].

Si une valeur source correspond au nom de l'un des paramètres spéciaux décrits ci-dessous, elle doit être précédée du symbole « `\` ».

La valeur résultante peut contenir du texte, une variable (0.9.0) ou une combinaison des deux (1.11.0).

Les paramètres spéciaux suivants sont aussi pris en charge :

- **`default` *value***

  définit la valeur résultante si la valeur source ne correspond à aucune des variantes indiquées. Sans `default`, la valeur résultante par défaut est une chaîne vide.

- **`hostnames`**

  indique que les valeurs sources peuvent être des noms d'hôtes avec un masque de préfixe ou de suffixe :

  ```nginx
  *.example.com 1;
  example.*     1;
  ```

  Les deux enregistrements suivants

  ```nginx
  example.com   1;
  *.example.com 1;
  ```

  peuvent être combinés :

  ```nginx
  .example.com  1;
  ```

  Ce paramètre doit être indiqué avant la liste des valeurs.

- **`include` *file***

  inclut un fichier de valeurs. Il peut y avoir plusieurs inclusions.

- **`volatile`**

  indique que la variable ne peut pas être mise en cache (1.11.7).

La recherche s'effectue dans l'ordre de priorité suivant et s'arrête à la première variante correspondante :

1. la valeur chaîne sans masque
2. la plus longue valeur chaîne avec un masque de préfixe, par exemple « `*.example.com` »
3. la plus longue valeur chaîne avec un masque de suffixe, par exemple « `mail.*` »
4. la première expression régulière correspondante (dans l'ordre d'apparition dans le fichier de configuration)
5. la valeur par défaut

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

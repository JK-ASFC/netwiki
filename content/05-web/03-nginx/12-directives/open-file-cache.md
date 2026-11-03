---
title: "open_file_cache"
description: "Directive nginx open_file_cache (ngx_http_core_module) — Configure un cache pouvant contenir : - les descripteurs de fichiers ouverts, leur taille et leur date de modification ; - des informations sur l'existence des répertoires ; - les erreurs de…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `open_file_cache off;` ou `open_file_cache max=N [inactive=time];` |
| **Valeur par défaut** | `open_file_cache off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Configure un cache pouvant contenir :

- les descripteurs de fichiers ouverts, leur taille et leur date de modification ;
- des informations sur l'existence des répertoires ;
- les erreurs de recherche de fichiers, comme « file not found » (fichier introuvable), « no read permission » (pas de droit de lecture), etc.

  > [!NOTE]
  > La mise en cache des erreurs doit être activée séparément avec la directive [[12-directives/open-file-cache-errors|open_file_cache_errors]].

La directive accepte les paramètres suivants :

- **`max`**

  définit le nombre maximal d'éléments dans le cache ; en cas de débordement, les éléments les moins récemment utilisés (LRU) sont supprimés ;

- **`inactive`**

  définit la durée au bout de laquelle un élément est supprimé du cache s'il n'a pas été utilisé ; 60 secondes par défaut ;

- **`off`**

  désactive le cache.

Exemple :

```nginx
open_file_cache          max=1000 inactive=20s;
open_file_cache_valid    30s;
open_file_cache_min_uses 2;
open_file_cache_errors   on;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

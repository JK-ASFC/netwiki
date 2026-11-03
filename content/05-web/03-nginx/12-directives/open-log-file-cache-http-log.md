---
title: "open_log_file_cache (ngx_http_log_module)"
description: "Directive nginx open_log_file_cache (ngx_http_log_module) — Définit un cache qui conserve les descripteurs de fichiers des journaux fréquemment utilisés dont le nom contient des variables. La directive accepte les paramètres suivants : - max définit le nombre…"
tags: [nginx, directive, ngx_http_log_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `open_log_file_cache max=N [inactive=time] [min_uses=N] [valid=time];` ou `open_log_file_cache off;` |
| **Valeur par défaut** | `open_log_file_cache off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_log_module\|ngx_http_log_module]] |

## Utilisation

Définit un cache qui conserve les descripteurs de fichiers des journaux fréquemment utilisés dont le nom contient des variables. La directive accepte les paramètres suivants :

- **`max`**

  définit le nombre maximal de descripteurs dans le cache ; lorsque le cache est plein, les descripteurs les moins récemment utilisés (LRU) sont fermés

- **`inactive`**

  définit la durée au bout de laquelle un descripteur en cache est fermé s'il n'a pas été utilisé ; 10 secondes par défaut

- **`min_uses`**

  définit le nombre minimal d'utilisations du fichier pendant la durée définie par le paramètre `inactive` pour que le descripteur reste ouvert dans le cache ; 1 par défaut

- **`valid`**

  définit la durée au bout de laquelle on vérifie que le fichier existe toujours sous le même nom ; 60 secondes par défaut

- **`off`**

  désactive le cache

Exemple d'utilisation :

```nginx
open_log_file_cache max=1000 inactive=20s valid=1m min_uses=2;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

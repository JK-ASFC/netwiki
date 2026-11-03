---
title: "open_file_cache_min_uses"
description: "Directive nginx open_file_cache_min_uses (ngx_http_core_module) — Définit le nombre (number) minimal d'accès à un fichier pendant la période définie par le paramètre inactive de la directive open_file_cache pour que son descripteur reste ouvert dans le cache."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `open_file_cache_min_uses number;` |
| **Valeur par défaut** | `open_file_cache_min_uses 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le nombre (*number*) minimal d'accès à un fichier pendant la période définie par le paramètre `inactive` de la directive [[12-directives/open-file-cache|open_file_cache]] pour que son descripteur reste ouvert dans le cache.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

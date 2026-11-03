---
title: "scgi_temp_path"
description: "Directive nginx scgi_temp_path (ngx_http_scgi_module) — Définit le répertoire des fichiers temporaires contenant les données reçues des serveurs SCGI. Jusqu'à trois niveaux de sous-répertoires peuvent être utilisés sous ce répertoire. Par exemple, avec la…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_temp_path path [level1 [level2 [level3]]];` |
| **Valeur par défaut** | `scgi_temp_path scgi_temp;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Définit le répertoire des fichiers temporaires contenant les données reçues des serveurs SCGI. Jusqu'à trois niveaux de sous-répertoires peuvent être utilisés sous ce répertoire. Par exemple, avec la configuration suivante

```nginx
scgi_temp_path /spool/nginx/scgi_temp 1 2;
```

un fichier temporaire peut ressembler à ceci :

```nginx
/spool/nginx/scgi_temp/7/45/00000123457
```

Voir aussi le paramètre `use_temp_path` de la directive [[12-directives/scgi-cache-path|scgi_cache_path]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

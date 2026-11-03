---
title: "min_delete_depth"
description: "Directive nginx min_delete_depth (ngx_http_dav_module) — Permet à la méthode DELETE de supprimer des fichiers si le nombre d'éléments du chemin de la requête n'est pas inférieur au nombre indiqué. Par exemple, la directive nginx min_delete_depth 4; permet…"
tags: [nginx, directive, ngx_http_dav_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `min_delete_depth number;` |
| **Valeur par défaut** | `min_delete_depth 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_dav_module\|ngx_http_dav_module]] |

## Utilisation

Permet à la méthode DELETE de supprimer des fichiers si le nombre d'éléments du chemin de la requête n'est pas inférieur au nombre indiqué. Par exemple, la directive

```nginx
min_delete_depth 4;
```

permet de supprimer des fichiers pour les requêtes

```nginx
/users/00/00/name
/users/00/00/name/pic.jpg
/users/00/00/page.html
```

et refuse la suppression de

```nginx
/users/00/00
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

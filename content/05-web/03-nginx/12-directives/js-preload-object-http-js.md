---
title: "js_preload_object (ngx_http_js_module)"
description: "Directive nginx js_preload_object (ngx_http_js_module) — Précharge un objet immuable lors de la configuration. name est le nom de la variable globale par laquelle l'objet est accessible dans le code njs ; s'il n'est pas indiqué, le nom du fichier est…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_preload_object name.json \| name from file.json;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.8 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Précharge un [[10-guides/04-njs/preload-objects|objet immuable]] lors de la configuration. `name` est le nom de la variable globale par laquelle l'objet est accessible dans le code njs ; s'il n'est pas indiqué, le nom du fichier est utilisé.

```nginx
js_preload_object map.json;
```

Ici, `map` sert de nom pour accéder à l'objet préchargé.

Plusieurs directives `js_preload_object` peuvent être indiquées.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

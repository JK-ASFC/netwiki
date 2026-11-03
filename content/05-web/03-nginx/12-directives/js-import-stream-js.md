---
title: "js_import (ngx_stream_js_module)"
description: "Directive nginx js_import (ngx_stream_js_module) — Importe un module qui met en œuvre des gestionnaires de session et de variables en njs. export_name sert d'espace de noms pour accéder aux fonctions du module. S'il n'est pas indiqué, le nom du…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_import module.js \| export_name from module.js;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.4.0 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Importe un module qui met en œuvre des gestionnaires de session et de variables en njs. `export_name` sert d'espace de noms pour accéder aux fonctions du module. S'il n'est pas indiqué, le nom du module sert d'espace de noms.

```nginx
js_import stream.js;
```

Ici, le nom de module `stream` sert d'espace de noms pour accéder aux exports. Si le module importé exporte `foo()`, on y fait référence avec `stream.foo`.

Plusieurs directives `js_import` peuvent être indiquées.

> [!NOTE]
> La directive peut être indiquée au niveau `server` depuis la version 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

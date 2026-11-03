---
title: "scgi_hide_header"
description: "Directive nginx scgi_hide_header (ngx_http_scgi_module) — Par défaut, nginx ne transmet pas au client les champs d'en-tête Status et X-Accel-... de la réponse d'un serveur SCGI. La directive scgi_hide_header ajoute d'autres champs à ne pas transmettre. Pour…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_hide_header field;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Par défaut, nginx ne transmet pas au client les champs d'en-tête `Status` et `X-Accel-...` de la réponse d'un serveur SCGI. La directive `scgi_hide_header` ajoute d'autres champs à ne pas transmettre. Pour au contraire autoriser la transmission de champs, utiliser la directive [[12-directives/scgi-pass-header|scgi_pass_header]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

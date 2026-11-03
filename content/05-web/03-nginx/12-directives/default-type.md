---
title: "default_type"
description: "Directive nginx default_type (ngx_http_core_module) — Définit le type MIME par défaut d'une réponse. La correspondance entre extensions de fichiers et types MIME se règle avec la directive types."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `default_type mime-type;` |
| **Valeur par défaut** | `default_type text/plain;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le type MIME par défaut d'une réponse. La correspondance entre extensions de fichiers et types MIME se règle avec la directive [[12-directives/types|types]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

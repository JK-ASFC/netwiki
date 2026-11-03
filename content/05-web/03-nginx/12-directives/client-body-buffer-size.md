---
title: "client_body_buffer_size"
description: "Directive nginx client_body_buffer_size (ngx_http_core_module) — Définit la taille du tampon de lecture du corps de la requête du client. Si le corps est plus grand que le tampon, tout ou partie du corps est écrit dans un fichier temporaire. Par défaut, le tampon…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_body_buffer_size size;` |
| **Valeur par défaut** | `client_body_buffer_size 8k\|16k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit la taille du tampon de lecture du corps de la requête du client. Si le corps est plus grand que le tampon, tout ou partie du corps est écrit dans un [[12-directives/client-body-temp-path|fichier temporaire]]. Par défaut, le tampon fait deux pages mémoire : 8K sur x86, les autres plates-formes 32 bits et x86-64 ; généralement 16K sur les autres plates-formes 64 bits.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

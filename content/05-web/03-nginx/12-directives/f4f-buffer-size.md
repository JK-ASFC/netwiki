---
title: "f4f_buffer_size"
description: "Directive nginx f4f_buffer_size (ngx_http_f4f_module) — Définit la taille (size) du tampon utilisé pour lire le fichier d'index .f4x."
tags: [nginx, directive, ngx_http_f4f_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `f4f_buffer_size size;` |
| **Valeur par défaut** | `f4f_buffer_size 512k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_f4f_module\|ngx_http_f4f_module]] |

## Utilisation

Définit la taille (*size*) du tampon utilisé pour lire le fichier d'index `.f4x`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

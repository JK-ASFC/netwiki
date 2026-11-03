---
title: "proxy_headers_hash_bucket_size"
description: "Directive nginx proxy_headers_hash_bucket_size (ngx_http_proxy_module) — Définit la taille (size) des compartiments des tables de hachage utilisées par les directives proxy_hide_header et proxy_set_header. Le réglage des tables de hachage est détaillé dans un document…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_headers_hash_bucket_size size;` |
| **Valeur par défaut** | `proxy_headers_hash_bucket_size 64;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit la taille (*size*) des compartiments des tables de hachage utilisées par les directives [[12-directives/proxy-hide-header|proxy_hide_header]] et [[12-directives/proxy-set-header|proxy_set_header]]. Le réglage des tables de hachage est détaillé dans un [[10-guides/01-introduction/hash|document distinct]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

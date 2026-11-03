---
title: "client_header_buffer_size"
description: "Directive nginx client_header_buffer_size (ngx_http_core_module) — Définit la taille du tampon de lecture de l'en-tête de la requête du client. Pour la plupart des requêtes, un tampon de 1K octets suffit. Mais si la requête contient de longs cookies ou provient d'un…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_header_buffer_size size;` |
| **Valeur par défaut** | `client_header_buffer_size 1k;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit la taille du tampon de lecture de l'en-tête de la requête du client. Pour la plupart des requêtes, un tampon de 1K octets suffit. Mais si la requête contient de longs cookies ou provient d'un client WAP, elle peut dépasser 1K. Si une ligne de requête ou un champ d'en-tête ne tient pas dans ce tampon, des tampons plus grands, configurés par la directive [[12-directives/large-client-header-buffers|large_client_header_buffers]], sont alloués.

Si la directive est indiquée au niveau [[12-directives/server-http-core|server]], la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la section « [[10-guides/02-http/server-names|Choix du serveur virtuel]] ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

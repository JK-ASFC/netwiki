---
title: "proxy_http_version"
description: "Directive nginx proxy_http_version (ngx_http_proxy_module) — Définit la version du protocole HTTP utilisée pour le relais. Depuis la version 1.29.7, la version 1.1 est utilisée par défaut ; auparavant, c'était la version 1.0. Les versions 1.1 ou 2 (1.29.4)…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_http_version 1.0 \| 1.1 \| 2;` |
| **Valeur par défaut** | `proxy_http_version 1.1;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.4 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit la version du protocole HTTP utilisée pour le relais. Depuis la version 1.29.7, la version 1.1 est utilisée par défaut ; auparavant, c'était la version 1.0. Les versions 1.1 ou 2 (1.29.4) sont recommandées avec les connexions [[12-directives/keepalive|keepalive]] et l'[[12-directives/ntlm|authentification NTLM]].

> [!NOTE]
> La version 2 nécessite le module [[11-modules/02-http/ngx_http_v2_module|ngx_http_v2_module]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

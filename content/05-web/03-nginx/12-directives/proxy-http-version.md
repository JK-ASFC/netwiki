---
title: "proxy_http_version"
description: "Directive nginx proxy_http_version (ngx_http_proxy_module) — Sets the HTTP protocol version for proxying. Since 1.29.7, version 1.1 is used by default. Before 1.29.7, version 1.0 was used by default. Version 1.1 or 2 (1.29.4) is recommended for use with…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_http_version 1.0 \| 1.1 \| 2;` |
| **Valeur par défaut** | `proxy_http_version 1.1;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.4 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Sets the HTTP protocol version for proxying. Since 1.29.7, version 1.1 is used by default. Before 1.29.7, version 1.0 was used by default. Version 1.1 or 2 (1.29.4) is recommended for use with [[12-directives/keepalive|keepalive]] connections and [[12-directives/ntlm|NTLM authentication]].

> [!NOTE]
> Version 2 requires the [[11-modules/02-http/ngx_http_v2_module|ngx_http_v2_module]] module.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

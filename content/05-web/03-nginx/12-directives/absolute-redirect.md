---
title: "absolute_redirect"
description: "Directive nginx absolute_redirect (ngx_http_core_module) — If disabled, redirects issued by nginx will be relative. See also server_name_in_redirect and port_in_redirect directives."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `absolute_redirect on \| off;` |
| **Valeur par défaut** | `absolute_redirect on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.11.8 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

If disabled, redirects issued by nginx will be relative.

See also [[12-directives/server-name-in-redirect|server_name_in_redirect]] and [[12-directives/port-in-redirect|port_in_redirect]] directives.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "userid_service"
description: "Directive nginx userid_service (ngx_http_userid_module) — If identifiers are issued by multiple servers (services), each service should be assigned its own number to ensure that client identifiers are unique. For version 1 cookies, the default value is…"
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid_service number;` |
| **Valeur par défaut** | `userid_service IP address of the server;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

If identifiers are issued by multiple servers (services), each service should be assigned its own *number* to ensure that client identifiers are unique. For version 1 cookies, the default value is zero. For version 2 cookies, the default value is the number composed from the last four octets of the server’s IP address.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

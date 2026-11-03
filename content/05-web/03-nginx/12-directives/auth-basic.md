---
title: "auth_basic"
description: "Directive nginx auth_basic (ngx_http_auth_basic_module) — Enables validation of user name and password using the “HTTP Basic Authentication” protocol. The specified parameter is used as a realm. Parameter value can contain variables (1.3.10, 1.2.7). The…"
tags: [nginx, directive, ngx_http_auth_basic_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_basic string \| off;` |
| **Valeur par défaut** | `auth_basic off;` |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_auth_basic_module\|ngx_http_auth_basic_module]] |

## Utilisation

Enables validation of user name and password using the “HTTP Basic Authentication” protocol. The specified parameter is used as a *realm*. Parameter value can contain variables (1.3.10, 1.2.7). The special value `off` cancels the effect of the `auth_basic` directive inherited from the previous configuration level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

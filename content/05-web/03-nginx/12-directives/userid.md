---
title: "userid"
description: "Directive nginx userid (ngx_http_userid_module) — Enables or disables setting cookies and logging the received cookies: - on enables the setting of version 2 cookies and logging of the received cookies; - v1 enables the setting of version 1 cookies…"
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid on \| v1 \| log \| off;` |
| **Valeur par défaut** | `userid off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

Enables or disables setting cookies and logging the received cookies:

- **`on`**

  enables the setting of version 2 cookies and logging of the received cookies;

- **`v1`**

  enables the setting of version 1 cookies and logging of the received cookies;

- **`log`**

  disables the setting of cookies, but enables logging of the received cookies;

- **`off`**

  disables the setting of cookies and logging of the received cookies.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

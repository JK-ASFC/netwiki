---
title: "valid_referers"
description: "Directive nginx valid_referers (ngx_http_referer_module) — Specifies the Referer request header field values that will cause the embedded $invalid_referer variable to be set to an empty string. Otherwise, the variable will be set to “1”. Search for a match…"
tags: [nginx, directive, ngx_http_referer_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `valid_referers none \| blocked \| server_names \| string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_referer_module\|ngx_http_referer_module]] |

## Utilisation

Specifies the `Referer` request header field values that will cause the embedded `$invalid_referer` variable to be set to an empty string. Otherwise, the variable will be set to “`1`”. Search for a match is case-insensitive.

Parameters can be as follows:

- **`none`**

  the `Referer` field is missing in the request header;

- **`blocked`**

  the `Referer` field is present in the request header, but its value has been deleted by a firewall or proxy server; such values are strings that do not start with “`http://`” or “`https://`”;

- **`server_names`**

  the `Referer` request header field contains one of the server names;

- **arbitrary string**

  defines a server name and an optional URI prefix. A server name can have an “`*`” at the beginning or end. During the checking, the server’s port in the `Referer` field is ignored;

- **regular expression**

  the first symbol should be a “`~`”. It should be noted that an expression will be matched against the text starting after the “`http://`” or “`https://`”.

Exemple :

```nginx
valid_referers none blocked server_names
               *.example.com example.* www.example.org/galleries/
               ~\.google\.;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "secure_link_md5"
description: "Directive nginx secure_link_md5 (ngx_http_secure_link_module) — Defines an expression for which the MD5 hash value will be computed and compared with the value passed in a request. The expression should contain the secured part of a link (resource) and a secret…"
tags: [nginx, directive, ngx_http_secure_link_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `secure_link_md5 expression;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_secure_link_module\|ngx_http_secure_link_module]] |

## Utilisation

Defines an expression for which the MD5 hash value will be computed and compared with the value passed in a request.

The expression should contain the secured part of a link (resource) and a secret ingredient. If the link has a limited lifetime, the expression should also contain `$secure_link_expires`.

To prevent unauthorized access, the expression may contain some information about the client, such as its address and browser version.

Exemple :

```nginx
location /s/ {
    secure_link $arg_md5,$arg_expires;
    secure_link_md5 "$secure_link_expires$uri$remote_addr secret";

    if ($secure_link = "") {
        return 403;
    }

    if ($secure_link = "0") {
        return 410;
    }

    ...
}
```

The “`/s/link?md5=_e4Nc3iduzkWRm01TBBNYw&expires=2147483647`” link restricts access to “`/s/link`” for the client with the IP address 127.0.0.1. The link also has the limited lifetime until January 19, 2038 (GMT).

On UNIX, the *md5* request argument value can be obtained as:

```nginx
echo -n '2147483647/s/link127.0.0.1 secret' | \
    openssl md5 -binary | openssl base64 | tr +/ -_ | tr -d =
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

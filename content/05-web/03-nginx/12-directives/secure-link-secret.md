---
title: "secure_link_secret"
description: "Directive nginx secure_link_secret (ngx_http_secure_link_module) — Defines a secret word used to check authenticity of requested links. The full URI of a requested link looks as follows: nginx /prefix/hash/link where hash is a hexadecimal representation of the MD5…"
tags: [nginx, directive, ngx_http_secure_link_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `secure_link_secret word;` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_secure_link_module\|ngx_http_secure_link_module]] |

## Utilisation

Defines a secret *word* used to check authenticity of requested links.

The full URI of a requested link looks as follows:

```nginx
/prefix/hash/link
```

where *hash* is a hexadecimal representation of the MD5 hash computed for the concatenation of the link and secret word, and *prefix* is an arbitrary string without slashes.

If the requested link passes the authenticity check, the `$secure_link` variable is set to the link extracted from the request URI. Otherwise, the `$secure_link` variable is set to an empty string.

Exemple :

```nginx
location /p/ {
    secure_link_secret secret;

    if ($secure_link = "") {
        return 403;
    }

    rewrite ^ /secure/$secure_link;
}

location /secure/ {
    internal;
}
```

A request of “`/p/5e814704a28d9bc1914ff19fa0c4a00a/link`” will be internally redirected to “`/secure/link`”.

On UNIX, the hash value for this example can be obtained as:

```nginx
echo -n 'linksecret' | openssl md5 -hex
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

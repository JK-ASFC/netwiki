---
title: "alias"
description: "Directive nginx alias (ngx_http_core_module) — Defines a replacement for the specified location. For example, with the following configuration nginx location /i/ { alias /data/w3/images/; } on request of “/i/top.gif”, the file…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `alias path;` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Defines a replacement for the specified location. For example, with the following configuration

```nginx
location /i/ {
    alias /data/w3/images/;
}
```

on request of “`/i/top.gif`”, the file `/data/w3/images/top.gif` will be sent.

The *path* value can contain variables, except `$document_root` and `$realpath_root`.

If `alias` is used inside a location defined with a regular expression then its value specifies a complete file path (0.7.40). Such path should typically refer to the captures contained within the regular expression:

```nginx
location ~ ^/users/(.+\.(?:gif|jpe?g|png))$ {
    alias /data/w3/images/$1;
}
```

If `alias` is used inside a predicate location then its value specifies a complete file path.

When location matches the last part of the directive’s value:

```nginx
location /images/ {
    alias /data/w3/images/;
}
```

it is better to use the [[12-directives/root|root]] directive instead:

```nginx
location /images/ {
    root /data/w3;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

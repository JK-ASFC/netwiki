---
title: "ngx_http_charset_module"
description: "Module nginx ngx_http_charset_module — The ngx_http_charset_module module adds the specified charset to the Content-Type response header field. In addition, the module can convert data from one charset to another, with some limitations:"
tags: [nginx, module, ngx_http_charset_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_charset_module` module adds the specified charset to the `Content-Type` response header field. In addition, the module can convert data from one charset to another, with some limitations:

- conversion is performed one way — from server to client,
- only single-byte charsets can be converted
- or single-byte charsets to/from UTF-8.

## Exemple de configuration

```nginx
include        conf/koi-win;

charset        windows-1251;
source_charset koi8-r;
```

## Directives

- [[12-directives/charset|charset]]
- [[12-directives/charset-map|charset_map]]
- [[12-directives/charset-types|charset_types]]
- [[12-directives/override-charset|override_charset]]
- [[12-directives/source-charset|source_charset]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ngx_http_xslt_module"
description: "Module nginx ngx_http_xslt_module — The ngx_http_xslt_module (0.7.8+) is a filter that transforms XML responses using one or more XSLT stylesheets."
tags: [nginx, module, ngx_http_xslt_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_xslt_module` (0.7.8+) is a filter that transforms XML responses using one or more XSLT stylesheets.

This module is not built by default, it should be enabled with the `--with-http_xslt_module` configuration parameter.

> [!NOTE]
> This module requires the [libxml2](http://xmlsoft.org) and [libxslt](http://xmlsoft.org/XSLT/) libraries.

## Example Configuration

```nginx
location / {
    xml_entities    /site/dtd/entities.dtd;
    xslt_stylesheet /site/xslt/one.xslt param=value;
    xslt_stylesheet /site/xslt/two.xslt;
}
```

## Directives

- [[12-directives/xml-entities|xml_entities]]
- [[12-directives/xml-external-entities|xml_external_entities]]
- [[12-directives/xslt-last-modified|xslt_last_modified]]
- [[12-directives/xslt-param|xslt_param]]
- [[12-directives/xslt-string-param|xslt_string_param]]
- [[12-directives/xslt-stylesheet|xslt_stylesheet]]
- [[12-directives/xslt-types|xslt_types]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

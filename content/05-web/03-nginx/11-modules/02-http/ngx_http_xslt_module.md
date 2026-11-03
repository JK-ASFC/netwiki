---
title: "ngx_http_xslt_module"
description: "Module nginx ngx_http_xslt_module — Le module ngx_http_xslt_module (0.7.8+) est un filtre qui transforme les réponses XML à l'aide d'une ou plusieurs feuilles de style XSLT."
tags: [nginx, module, ngx_http_xslt_module]
icon: puzzle
---

Le module `ngx_http_xslt_module` (0.7.8+) est un filtre qui transforme les réponses XML à l'aide d'une ou plusieurs feuilles de style XSLT.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_xslt_module`.

> [!NOTE]
> Ce module nécessite les bibliothèques [libxml2](http://xmlsoft.org) et [libxslt](http://xmlsoft.org/XSLT/).

## Exemple de configuration

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

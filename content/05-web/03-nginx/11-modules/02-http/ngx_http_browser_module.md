---
title: "ngx_http_browser_module"
description: "Module nginx ngx_http_browser_module — The ngx_http_browser_module module creates variables whose values depend on the value of the User-Agent request header field:"
tags: [nginx, module, ngx_http_browser_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_browser_module` module creates variables whose values depend on the value of the `User-Agent` request header field:

- **`$modern_browser`**

  equals the value set by the [[12-directives/modern-browser-value|modern_browser_value]] directive, if a browser was identified as modern;

- **`$ancient_browser`**

  equals the value set by the [[12-directives/ancient-browser-value|ancient_browser_value]] directive, if a browser was identified as ancient;

- **`$msie`**

  equals “1” if a browser was identified as MSIE of any version.

## Exemple de configuration

Choosing an index file:

```nginx
modern_browser_value "modern.";

modern_browser msie      5.5;
modern_browser gecko     1.0.0;
modern_browser opera     9.0;
modern_browser safari    413;
modern_browser konqueror 3.0;

index index.${modern_browser}html index.html;
```

Redirection for old browsers:

```nginx
modern_browser msie      5.0;
modern_browser gecko     0.9.1;
modern_browser opera     8.0;
modern_browser safari    413;
modern_browser konqueror 3.0;

modern_browser unlisted;

ancient_browser Links Lynx netscape4;

if ($ancient_browser) {
    rewrite ^ /ancient.html;
}
```

## Directives

- [[12-directives/ancient-browser|ancient_browser]]
- [[12-directives/ancient-browser-value|ancient_browser_value]]
- [[12-directives/modern-browser|modern_browser]]
- [[12-directives/modern-browser-value|modern_browser_value]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

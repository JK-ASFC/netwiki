---
title: "ngx_http_browser_module"
description: "Module nginx ngx_http_browser_module — Le module ngx_http_browser_module crée des variables dont la valeur dépend du champ d'en-tête de requête User-Agent :"
tags: [nginx, module, ngx_http_browser_module]
icon: puzzle
---

Le module `ngx_http_browser_module` crée des variables dont la valeur dépend du champ d'en-tête de requête `User-Agent` :

- **`$modern_browser`**

  vaut la valeur définie par la directive [[12-directives/modern-browser-value|modern_browser_value]] si le navigateur est identifié comme moderne ;

- **`$ancient_browser`**

  vaut la valeur définie par la directive [[12-directives/ancient-browser-value|ancient_browser_value]] si le navigateur est identifié comme ancien ;

- **`$msie`**

  vaut « 1 » si le navigateur est identifié comme MSIE, quelle que soit sa version.

## Exemple de configuration

Choix d'un fichier d'index :

```nginx
modern_browser_value "modern.";

modern_browser msie      5.5;
modern_browser gecko     1.0.0;
modern_browser opera     9.0;
modern_browser safari    413;
modern_browser konqueror 3.0;

index index.${modern_browser}html index.html;
```

Redirection des anciens navigateurs :

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

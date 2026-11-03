---
title: "alias"
description: "Directive nginx alias (ngx_http_core_module) — Définit un remplacement pour le bloc location indiqué. Par exemple, avec la configuration suivante nginx location /i/ { alias /data/w3/images/; } à la requête « /i/top.gif », c'est le fichier…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `alias path;` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit un remplacement pour le bloc location indiqué. Par exemple, avec la configuration suivante

```nginx
location /i/ {
    alias /data/w3/images/;
}
```

à la requête « `/i/top.gif` », c'est le fichier `/data/w3/images/top.gif` qui est envoyé.

La valeur *path* peut contenir des variables, sauf `$document_root` et `$realpath_root`.

Si `alias` est utilisé dans un bloc location défini par une expression régulière, sa valeur indique un chemin de fichier complet (0.7.40). Ce chemin fait généralement référence aux captures de l'expression régulière :

```nginx
location ~ ^/users/(.+\.(?:gif|jpe?g|png))$ {
    alias /data/w3/images/$1;
}
```

Si `alias` est utilisé dans un bloc location à prédicat, sa valeur indique un chemin de fichier complet.

Lorsque le bloc location correspond à la dernière partie de la valeur de la directive :

```nginx
location /images/ {
    alias /data/w3/images/;
}
```

il vaut mieux utiliser la directive [[12-directives/root|root]] :

```nginx
location /images/ {
    root /data/w3;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

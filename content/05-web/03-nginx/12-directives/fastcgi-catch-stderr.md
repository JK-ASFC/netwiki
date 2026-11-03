---
title: "fastcgi_catch_stderr"
description: "Directive nginx fastcgi_catch_stderr (ngx_http_fastcgi_module) — Définit une chaîne à rechercher dans le flux d'erreurs d'une réponse reçue d'un serveur FastCGI. Si la chaîne (string) est trouvée, le serveur FastCGI est considéré comme ayant renvoyé une réponse…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_catch_stderr string;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Définit une chaîne à rechercher dans le flux d'erreurs d'une réponse reçue d'un serveur FastCGI. Si la chaîne (*string*) est trouvée, le serveur FastCGI est considéré comme ayant renvoyé une [[12-directives/fastcgi-next-upstream|réponse non valide]]. Cela permet de traiter les erreurs applicatives dans nginx, par exemple :

```nginx
location /php/ {
    fastcgi_pass backend:9000;
    ...
    fastcgi_catch_stderr "PHP Fatal error";
    fastcgi_next_upstream error timeout invalid_header;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

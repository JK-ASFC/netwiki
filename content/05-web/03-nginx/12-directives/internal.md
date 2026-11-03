---
title: "internal"
description: "Directive nginx internal (ngx_http_core_module) — Indique que le bloc location ne peut servir qu'aux requêtes internes. Pour les requêtes externes, l'erreur client 404 Not Found est renvoyée. Les requêtes internes sont : - les requêtes redirigées…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `internal;` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Indique que le bloc location ne peut servir qu'aux requêtes internes. Pour les requêtes externes, l'erreur client `404 Not Found` est renvoyée. Les requêtes internes sont :

- les requêtes redirigées par les directives [[12-directives/error-page|error_page]], [[12-directives/index|index]], [[12-directives/internal-redirect|internal_redirect]], [[12-directives/random-index|random_index]] et [[12-directives/try-files|try_files]] ;
- les requêtes redirigées par le champ d'en-tête de réponse `X-Accel-Redirect` d'un serveur amont ;
- les sous-requêtes créées par la commande « `include virtual` » du module [[11-modules/02-http/ngx_http_ssi_module|ngx_http_ssi_module]], par les directives du module [[11-modules/02-http/ngx_http_addition_module|ngx_http_addition_module]] et par les directives [[12-directives/auth-request|auth_request]] et [[12-directives/mirror|mirror]] ;
- les requêtes modifiées par la directive [[12-directives/rewrite|rewrite]].

Exemple :

```nginx
error_page 404 /404.html;

location = /404.html {
    internal;
}
```

> [!NOTE]
> Le nombre de redirections internes est limité à 10 par requête pour éviter les boucles de traitement que peut provoquer une configuration incorrecte. Lorsque cette limite est atteinte, l'erreur `500 Internal Server Error` est renvoyée ; le message « rewrite or internal redirection cycle » apparaît alors dans le journal d'erreurs.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

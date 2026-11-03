---
title: "match (ngx_http_upstream_hc_module)"
description: "Directive nginx match (ngx_http_upstream_hc_module) — Définit l'ensemble nommé de tests servant à vérifier les réponses aux requêtes de vérification d'état. Les éléments suivants peuvent être testés dans une réponse : - status 200; le statut est 200 -…"
tags: [nginx, directive, ngx_http_upstream_hc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `match name { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_hc_module\|ngx_http_upstream_hc_module]] |

## Utilisation

Définit l'ensemble nommé de tests servant à vérifier les réponses aux requêtes de vérification d'état.

Les éléments suivants peuvent être testés dans une réponse :

- **`status 200;`**

  le statut est 200

- **`status ! 500;`**

  le statut n'est pas 500

- **`status 200 204;`**

  le statut est 200 ou 204

- **`status ! 301 302;`**

  le statut n'est ni 301 ni 302

- **`status 200-399;`**

  le statut est compris entre 200 et 399

- **`status ! 400-599;`**

  le statut n'est pas compris entre 400 et 599

- **`status 301-303 307;`**

  le statut est 301, 302, 303 ou 307

- **`header Content-Type = text/html;`**

  l'en-tête contient `Content-Type` avec la valeur `text/html`

- **`header Content-Type != text/html;`**

  l'en-tête contient `Content-Type` avec une valeur autre que `text/html`

- **`header Connection ~ close;`**

  l'en-tête contient `Connection` avec une valeur correspondant à l'expression régulière `close`

- **`header Connection !~ close;`**

  l'en-tête contient `Connection` avec une valeur ne correspondant pas à l'expression régulière `close`

- **`header Host;`**

  l'en-tête contient `Host`

- **`header ! X-Accel-Redirect;`**

  l'en-tête ne contient pas `X-Accel-Redirect`

- **`body ~ "Welcome to nginx!";`**

  le corps correspond à l'expression régulière « `Welcome to nginx!` »

- **`body !~ "Welcome to nginx!";`**

  le corps ne correspond pas à l'expression régulière « `Welcome to nginx!` »

- **`require` *$variable* `...;`**

  aucune des variables indiquées n'est vide ni égale à « 0 » (1.15.9).

Si plusieurs tests sont indiqués, la réponse ne correspond que si elle passe tous les tests.

> [!NOTE]
> Seuls les 256 premiers ko du corps de la réponse sont examinés.

Exemples :

```nginx
# status is 200, content type is "text/html",
# and body contains "Welcome to nginx!"
match welcome {
    status 200;
    header Content-Type = text/html;
    body ~ "Welcome to nginx!";
}
```

```nginx
# status is not one of 301, 302, 303, or 307, and header does not have "Refresh:"
match not_redirect {
    status ! 301-303 307;
    header ! Refresh;
}
```

```nginx
# status ok and not in maintenance mode
match server_ok {
    status 200-399;
    body !~ "maintenance mode";
}
```

```nginx
# status is 200 or 204
map $upstream_status $good_status {
    200 1;
    204 1;
}

match server_ok {
    require $good_status;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

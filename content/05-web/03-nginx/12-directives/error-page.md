---
title: "error_page"
description: "Directive nginx error_page (ngx_http_core_module) — Définit l'URI affiché pour les erreurs indiquées. La valeur uri peut contenir des variables. Exemple : nginx error_page 404 /404.html; error_page 500 502 503 504 /50x.html; Cela provoque une…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `error_page code ... [=[response]] uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit l'URI affiché pour les erreurs indiquées. La valeur *uri* peut contenir des variables.

Exemple :

```nginx
error_page 404             /404.html;
error_page 500 502 503 504 /50x.html;
```

Cela provoque une redirection interne vers l'*uri* indiqué, la méthode de la requête du client devenant « `GET` » (pour toutes les méthodes autres que « `GET` » et « `HEAD` »).

Il est en outre possible de remplacer le code de réponse par un autre avec la syntaxe « `=`*response* », par exemple :

```nginx
error_page 404 =200 /empty.gif;
```

Si une réponse d'erreur est traitée par un serveur mandaté ou un serveur FastCGI/uwsgi/SCGI/gRPC, et que ce serveur peut renvoyer différents codes de réponse (par exemple 200, 302, 401 ou 404), il est possible de répondre avec le code qu'il renvoie :

```nginx
error_page 404 = /404.php;
```

S'il n'est pas nécessaire de modifier l'URI et la méthode lors de la redirection interne, le traitement de l'erreur peut être confié à un bloc location nommé :

```nginx
location / {
    error_page 404 = @fallback;
}

location @fallback {
    proxy_pass http://backend;
}
```

> [!NOTE]
> Si le traitement de l'*uri* provoque une erreur, le code de statut de la dernière erreur survenue est renvoyé au client.

Il est aussi possible d'utiliser des redirections d'URL pour traiter les erreurs :

```nginx
error_page 403      http://example.com/forbidden.html;
error_page 404 =301 http://example.com/notfound.html;
```

Dans ce cas, le code de réponse 302 est renvoyé par défaut au client. Il ne peut être remplacé que par l'un des codes de redirection (301, 302, 303, 307 et 308).

> [!NOTE]
> Le code 307 n'était pas traité comme une redirection avant les versions 1.1.16 et 1.0.13.

> [!NOTE]
> Le code 308 n'était pas traité comme une redirection avant la version 1.13.0.

Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `error_page` n'est définie au niveau courant.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

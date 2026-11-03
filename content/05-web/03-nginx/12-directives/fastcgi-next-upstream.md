---
title: "fastcgi_next_upstream"
description: "Directive nginx fastcgi_next_upstream (ngx_http_fastcgi_module) — Indique dans quels cas une requête doit être transmise au serveur suivant : - error une erreur s'est produite lors de l'établissement de la connexion avec le serveur, de la transmission de la requête…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_next_upstream error \| timeout \| denied \| invalid_header \| http_500 \| http_503 \| http_403 \| http_404 \| http_429 \| non_idempotent \| off ...;` |
| **Valeur par défaut** | `fastcgi_next_upstream error timeout;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Indique dans quels cas une requête doit être transmise au serveur suivant :

- **`error`**

  une erreur s'est produite lors de l'établissement de la connexion avec le serveur, de la transmission de la requête ou de la lecture de l'en-tête de réponse ;

- **`timeout`**

  un délai a expiré lors de l'établissement de la connexion avec le serveur, de la transmission de la requête ou de la lecture de l'en-tête de réponse ;

- **`denied`**

  the server [[12-directives/fastcgi-allow-upstream|denied]] the connection (1.29.3);

  > [!NOTE]
  > Ce paramètre est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

- **`invalid_header`**

  le serveur a renvoyé une réponse vide ou non valide ;

- **`http_500`**

  le serveur a renvoyé une réponse de code 500 ;

- **`http_503`**

  le serveur a renvoyé une réponse de code 503 ;

- **`http_403`**

  le serveur a renvoyé une réponse de code 403 ;

- **`http_404`**

  le serveur a renvoyé une réponse de code 404 ;

- **`http_429`**

  le serveur a renvoyé une réponse de code 429 (1.11.13) ;

- **`non_idempotent`**

  normalement, les requêtes dont la méthode n'est pas [idempotente](https://datatracker.ietf.org/doc/html/rfc7231#section-4.2.2) (`POST`, `LOCK`, `PATCH`) ne sont pas transmises au serveur suivant si la requête a déjà été envoyée à un serveur amont (1.9.13) ; cette option autorise explicitement à les réessayer ;

- **`off`**

  désactive la transmission de la requête au serveur suivant.

La requête ne peut être transmise au serveur suivant que si rien n'a encore été envoyé au client. Si une erreur ou un dépassement de délai survient au milieu du transfert de la réponse, il est impossible d'y remédier.

The directive also defines what is considered an [[11-modules/02-http/ngx_http_upstream_module|unsuccessful attempt]] of communication with a server. The cases of `error`, `timeout`, `denied` and `invalid_header` are always considered unsuccessful attempts, even if they are not specified in the directive. The cases of `http_500`, `http_503`, and `http_429` are considered unsuccessful attempts only if they are specified in the directive. The cases of `http_403` and `http_404` are never considered unsuccessful attempts.

Passing a request to the next server can be limited by [[12-directives/fastcgi-next-upstream-tries|the number of tries]] and by [[12-directives/fastcgi-next-upstream-timeout|time]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

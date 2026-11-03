---
title: "memcached_next_upstream"
description: "Directive nginx memcached_next_upstream (ngx_http_memcached_module) — Indique dans quels cas une requête doit être transmise au serveur suivant : - error une erreur s'est produite lors de l'établissement de la connexion avec le serveur, de la transmission de la requête…"
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_next_upstream error \| timeout \| denied \| invalid_response \| not_found \| off ...;` |
| **Valeur par défaut** | `memcached_next_upstream error timeout;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Indique dans quels cas une requête doit être transmise au serveur suivant :

- **`error`**

  une erreur s'est produite lors de l'établissement de la connexion avec le serveur, de la transmission de la requête ou de la lecture de l'en-tête de réponse ;

- **`timeout`**

  un délai a expiré lors de l'établissement de la connexion avec le serveur, de la transmission de la requête ou de la lecture de l'en-tête de réponse ;

- **`denied`**

  the server [[12-directives/memcached-allow-upstream|denied]] the connection (1.29.3);

  > [!NOTE]
  > Ce paramètre est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

- **`invalid_response`**

  le serveur a renvoyé une réponse vide ou non valide ;

- **`not_found`**

  a response was not found on the server;

- **`off`**

  désactive la transmission de la requête au serveur suivant.

La requête ne peut être transmise au serveur suivant que si rien n'a encore été envoyé au client. Si une erreur ou un dépassement de délai survient au milieu du transfert de la réponse, il est impossible d'y remédier.

The directive also defines what is considered an [[11-modules/02-http/ngx_http_upstream_module|unsuccessful attempt]] of communication with a server. The cases of `error`, `timeout`, `denied` and `invalid_response` are always considered unsuccessful attempts, even if they are not specified in the directive. The case of `not_found` is never considered an unsuccessful attempt.

Passing a request to the next server can be limited by [[12-directives/memcached-next-upstream-tries|the number of tries]] and by [[12-directives/memcached-next-upstream-timeout|time]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

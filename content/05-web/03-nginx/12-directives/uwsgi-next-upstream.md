---
title: "uwsgi_next_upstream"
description: "Directive nginx uwsgi_next_upstream (ngx_http_uwsgi_module) — Indique dans quels cas une requête doit être transmise au serveur suivant : - error une erreur s'est produite lors de l'établissement de la connexion avec le serveur, de la transmission de la requête…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_next_upstream error \| timeout \| denied \| invalid_header \| http_500 \| http_503 \| http_403 \| http_404 \| http_429 \| non_idempotent \| off ...;` |
| **Valeur par défaut** | `uwsgi_next_upstream error timeout;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Indique dans quels cas une requête doit être transmise au serveur suivant :

- **`error`**

  une erreur s'est produite lors de l'établissement de la connexion avec le serveur, de la transmission de la requête ou de la lecture de l'en-tête de réponse ;

- **`timeout`**

  un délai a expiré lors de l'établissement de la connexion avec le serveur, de la transmission de la requête ou de la lecture de l'en-tête de réponse ;

- **`denied`**

  le serveur a [[12-directives/uwsgi-allow-upstream|refusé]] la connexion (1.29.3) ;

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

La directive définit aussi ce qui est considéré comme une [[11-modules/02-http/ngx_http_upstream_module|tentative échouée]] de communication avec un serveur. Les cas `error`, `timeout`, `denied` et `invalid_header` sont toujours considérés comme des échecs, même s'ils ne figurent pas dans la directive. Les cas `http_500`, `http_503` et `http_429` ne sont considérés comme des échecs que s'ils figurent dans la directive. Les cas `http_403` et `http_404` ne sont jamais considérés comme des échecs.

La transmission d'une requête au serveur suivant peut être limitée par le [[12-directives/uwsgi-next-upstream-tries|nombre de tentatives]] et par la [[12-directives/uwsgi-next-upstream-timeout|durée]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "db_next_upstream"
description: "Directive nginx db_next_upstream (ngx_http_db_module) — Specifies the conditions under which a request can be passed to the next database server: - error une erreur s'est produite lors de l'établissement de la connexion avec le serveur, de la transmission…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_next_upstream error \| timeout \| invalid_response \| not_found off ...;` ou `db_next_upstream off;` |
| **Valeur par défaut** | `db_next_upstream error timeout;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Specifies the conditions under which a request can be passed to the next database server:

- **`error`**

  une erreur s'est produite lors de l'établissement de la connexion avec le serveur, de la transmission de la requête ou de la lecture de l'en-tête de réponse ;

- **`timeout`**

  un délai a expiré lors de l'établissement de la connexion avec le serveur, de la transmission de la requête ou de la lecture de l'en-tête de réponse ;

- **`invalid_response`**

  server returned an invalid response. For the Redis backend, this also includes Redis error replies, such as authentication failures or key-value mismatch errors;

- **`not_found`**

  the requested key was not found. For the Redis backend, this corresponds to a nil reply to the `GET` command;

  > [!NOTE]
  > The parameter cannot be used when caching of `not_found` results is enabled with the [[12-directives/db-cache|db_cache]] directive.

- **`off`**

  désactive la transmission de la requête au serveur suivant.

La requête ne peut être transmise au serveur suivant que si rien n'a encore été envoyé au client. Si une erreur ou un dépassement de délai survient au milieu du transfert de la réponse, il est impossible d'y remédier.

The directive also defines what is considered an [[11-modules/02-http/ngx_http_upstream_module|unsuccessful attempt]] of communication with a server. The cases of `error` and `timeout`, are always considered unsuccessful attempts, even if they are not specified in the directive. The case of `invalid_response` is considered an unsuccessful attempt only if it is specified in the directive. The case of `not_found` is never considered an unsuccessful attempt.

Passing a request to the next server can be limited by [[12-directives/db-next-upstream-tries|the number of tries]] and by [[12-directives/db-next-upstream-timeout|time]].

The `not_found` parameter cannot be combined with enabled missing-key caching in [[12-directives/db-cache|db_cache]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

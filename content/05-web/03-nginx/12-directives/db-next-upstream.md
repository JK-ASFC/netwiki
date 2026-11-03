---
title: "db_next_upstream"
description: "Directive nginx db_next_upstream (ngx_http_db_module) — Indique dans quels cas une requête peut être transmise au serveur de base de données suivant : - error une erreur s'est produite lors de l'établissement de la connexion avec le serveur, de la…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_next_upstream error \| timeout \| invalid_response \| not_found off ...;` ou `db_next_upstream off;` |
| **Valeur par défaut** | `db_next_upstream error timeout;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Indique dans quels cas une requête peut être transmise au serveur de base de données suivant :

- **`error`**

  une erreur s'est produite lors de l'établissement de la connexion avec le serveur, de la transmission de la requête ou de la lecture de l'en-tête de réponse ;

- **`timeout`**

  un délai a expiré lors de l'établissement de la connexion avec le serveur, de la transmission de la requête ou de la lecture de l'en-tête de réponse ;

- **`invalid_response`**

  le serveur a renvoyé une réponse non valide. Avec Redis, cela inclut aussi les réponses d'erreur, comme les échecs d'authentification ou les erreurs de type de valeur ;

- **`not_found`**

  la clé demandée est introuvable. Avec Redis, cela correspond à une réponse nil à la commande `GET` ;

  > [!NOTE]
  > Ce paramètre ne peut pas être utilisé lorsque la mise en cache des résultats `not_found` est activée avec la directive [[12-directives/db-cache|db_cache]].

- **`off`**

  désactive la transmission de la requête au serveur suivant.

La requête ne peut être transmise au serveur suivant que si rien n'a encore été envoyé au client. Si une erreur ou un dépassement de délai survient au milieu du transfert de la réponse, il est impossible d'y remédier.

La directive définit aussi ce qui est considéré comme une [[11-modules/02-http/ngx_http_upstream_module|tentative échouée]] de communication avec un serveur. Les cas `error` et `timeout` sont toujours considérés comme des échecs, même s'ils ne figurent pas dans la directive. Le cas `invalid_response` n'est considéré comme un échec que s'il figure dans la directive. Le cas `not_found` n'est jamais considéré comme un échec.

La transmission d'une requête au serveur suivant peut être limitée par le [[12-directives/db-next-upstream-tries|nombre de tentatives]] et par la [[12-directives/db-next-upstream-timeout|durée]].

Le paramètre `not_found` ne peut pas être combiné avec la mise en cache des clés absentes de [[12-directives/db-cache|db_cache]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

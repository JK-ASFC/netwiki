---
title: "tunnel_next_upstream"
description: "Directive nginx tunnel_next_upstream (ngx_http_tunnel_module) — Indique dans quels cas une requête doit être transmise au serveur suivant : - error une erreur s'est produite lors de l'établissement de la connexion avec le serveur ou de la lecture de ses données ;…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_next_upstream error \| timeout \| denied \| off ...;` |
| **Valeur par défaut** | `tunnel_next_upstream error timeout;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Indique dans quels cas une requête doit être transmise au serveur suivant :

- **`error`**

  une erreur s'est produite lors de l'établissement de la connexion avec le serveur ou de la lecture de ses données ;

- **`timeout`**

  un délai a expiré lors de l'établissement de la connexion avec le serveur, de la transmission de la requête ou de la lecture de ses données ;

- **`denied`**

  le serveur a [[12-directives/tunnel-allow-upstream|refusé]] la connexion ;

  > [!NOTE]
  > Ce paramètre est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

- **`off`**

  désactive la transmission de la requête au serveur suivant.

La requête ne peut être transmise au serveur suivant que si rien n'a encore été envoyé au client. Si une erreur ou un dépassement de délai survient au milieu du transfert de la réponse, il est impossible d'y remédier.

La directive définit aussi ce qui est considéré comme une [[11-modules/02-http/ngx_http_upstream_module|tentative échouée]] de communication avec un serveur. Les cas `error`, `timeout` et `denied` sont toujours considérés comme des échecs, même s'ils ne figurent pas dans la directive.

La transmission d'une requête au serveur suivant peut être limitée par le [[12-directives/tunnel-next-upstream-tries|nombre de tentatives]] et par la [[12-directives/tunnel-next-upstream-timeout|durée]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

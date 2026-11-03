---
title: "tunnel_next_upstream"
description: "Directive nginx tunnel_next_upstream (ngx_http_tunnel_module) — Indique dans quels cas une requête doit être transmise au serveur suivant : - error an error occurred while establishing a connection with the server or reading data from the server; - timeout a…"
tags: [nginx, directive, ngx_http_tunnel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tunnel_next_upstream error \| timeout \| denied \| off ...;` |
| **Valeur par défaut** | `tunnel_next_upstream error timeout;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_tunnel_module\|ngx_http_tunnel_module]] |

## Utilisation

Indique dans quels cas une requête doit être transmise au serveur suivant :

- **`error`**

  an error occurred while establishing a connection with the server or reading data from the server;

- **`timeout`**

  a timeout has occurred while establishing a connection with the server, passing a request to it, or reading data from the server;

- **`denied`**

  the server [[12-directives/tunnel-allow-upstream|denied]] the connection;

  > [!NOTE]
  > Ce paramètre est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

- **`off`**

  désactive la transmission de la requête au serveur suivant.

La requête ne peut être transmise au serveur suivant que si rien n'a encore été envoyé au client. Si une erreur ou un dépassement de délai survient au milieu du transfert de la réponse, il est impossible d'y remédier.

The directive also defines what is considered an [[11-modules/02-http/ngx_http_upstream_module|unsuccessful attempt]] of communication with a server. The cases of `error`, `timeout`, and `denied` are always considered unsuccessful attempts, even if they are not specified in the directive.

Passing a request to the next server can be limited by [[12-directives/tunnel-next-upstream-tries|the number of tries]] and by [[12-directives/tunnel-next-upstream-timeout|time]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

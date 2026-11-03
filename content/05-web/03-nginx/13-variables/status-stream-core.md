---
title: "$status (ngx_stream_core_module)"
description: "Variable nginx $status (ngx_stream_core_module) — état de la session (1.11.4), parmi les valeurs suivantes : - 200 session terminée avec succès - 400 les données du client n'ont pas pu être analysées, par exemple l'en-tête du protocole PROXY - 403…"
tags: [nginx, variable, ngx_stream_core_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$status` |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

état de la session (1.11.4), parmi les valeurs suivantes :

- **`200`**

  session terminée avec succès

- **`400`**

  les données du client n'ont pas pu être analysées, par exemple l'en-tête du protocole PROXY

- **`403`**

  accès interdit, par exemple quand l'accès est restreint pour [[11-modules/03-stream/ngx_stream_access_module|certaines adresses client]]

- **`500`**

  erreur interne du serveur

- **`502`**

  passerelle incorrecte, par exemple si aucun serveur amont n'a pu être sélectionné ou joint.

- **`503`**

  service indisponible, par exemple quand l'accès est limité par le [[11-modules/03-stream/ngx_stream_limit_conn_module|nombre de connexions]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

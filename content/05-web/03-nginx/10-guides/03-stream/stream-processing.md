---
title: "Comment nginx traite une session TCP/UDP"
description: "Nginx — Comment nginx traite une session TCP/UDP. Une session TCP/UDP d'un client est traitée en étapes successives appelées phases :"
tags: [nginx, guide]
icon: book-open
---

Une session TCP/UDP d'un client est traitée en étapes successives appelées **phases** :

- **`Post-accept`**

  Première phase après l'acceptation d'une connexion client. Le module [[11-modules/03-stream/ngx_stream_realip_module|ngx_stream_realip_module]] est appelé à cette phase.

- **`Pre-access`**

  Vérification préliminaire de l'accès. Les modules [[11-modules/03-stream/ngx_stream_limit_conn_module|ngx_stream_limit_conn_module]] et [[11-modules/03-stream/ngx_stream_set_module|ngx_stream_set_module]] sont appelés à cette phase.

- **`Access`**

  Restriction de l'accès client avant le traitement effectif des données. À cette phase, le module [[11-modules/03-stream/ngx_stream_access_module|ngx_stream_access_module]] est appelé et, pour [[10-guides/04-njs/00-index|njs]], la directive [[12-directives/js-access-stream-js|js_access]].

- **`SSL`**

  Terminaison TLS/SSL. Le module [[11-modules/03-stream/ngx_stream_ssl_module|ngx_stream_ssl_module]] est appelé à cette phase.

- **`Preread`**

  Lecture des premiers octets de données dans le [[12-directives/preread-buffer-size|tampon de prélecture]] pour permettre à des modules comme [[11-modules/03-stream/ngx_stream_ssl_preread_module|ngx_stream_ssl_preread_module]] d'analyser les données avant leur traitement. Pour [[10-guides/04-njs/00-index|njs]], la directive [[12-directives/js-preread|js_preread]] est appelée à cette phase.

- **`Content`**

  Phase obligatoire où les données sont réellement traitées, généralement [[11-modules/03-stream/ngx_stream_proxy_module|relayées]] vers des serveurs [[11-modules/03-stream/ngx_stream_upstream_module|amont]], ou bien une valeur donnée est [[11-modules/03-stream/ngx_stream_return_module|renvoyée]] au client. Pour [[10-guides/04-njs/00-index|njs]], la directive [[12-directives/js-filter|js_filter]] est appelée à cette phase.

- **`Log`**

  Phase finale où le résultat du traitement de la session client est enregistré. Le module [[11-modules/03-stream/ngx_stream_log_module|ngx_stream_log_module]] est appelé à cette phase.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

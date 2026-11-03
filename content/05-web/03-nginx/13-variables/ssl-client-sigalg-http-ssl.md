---
title: "$ssl_client_sigalg (ngx_http_ssl_module)"
description: "Variable nginx $ssl_client_sigalg (ngx_http_ssl_module) — renvoie l'algorithme de signature du certificat du client pour la connexion SSL établie (1.29.3). NOTE La variable n'est prise en charge qu'avec OpenSSL 3.5 ou plus récent. Avec les versions plus…"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_client_sigalg` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

renvoie l'[algorithme de signature](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-16) du certificat du client pour la connexion SSL établie (1.29.3).

> [!NOTE]
> La variable n'est prise en charge qu'avec OpenSSL 3.5 ou plus récent. Avec les versions plus anciennes, sa valeur est une chaîne vide.

> [!NOTE]
> La variable n'est disponible que pour les nouvelles sessions.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

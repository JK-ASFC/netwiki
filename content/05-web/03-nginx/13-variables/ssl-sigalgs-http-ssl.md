---
title: "$ssl_sigalgs (ngx_http_ssl_module)"
description: "Variable nginx $ssl_sigalgs (ngx_http_ssl_module) — renvoie la liste des algorithmes de signature pris en charge par le client (1.31.2). Les valeurs connues sont listées par leur nom, les inconnues en hexadécimal, par exemple : nginx…"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_sigalgs` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

renvoie la liste des [algorithmes de signature](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-16) pris en charge par le client (1.31.2). Les valeurs connues sont listées par leur nom, les inconnues en hexadécimal, par exemple :

```nginx
0xfe00:rsa_pkcs1_sha256:rsa_pss_rsae_sha256:ecdsa_secp256r1_sha256
```

> [!NOTE]
> La variable n'est entièrement prise en charge qu'avec OpenSSL 4.0 ou plus récent. Avec OpenSSL 1.0.2 et suivants, les valeurs sont toujours affichées en hexadécimal. Avec les versions plus anciennes, sa valeur est une chaîne vide.

> [!NOTE]
> La variable n'est disponible que pour les nouvelles sessions.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

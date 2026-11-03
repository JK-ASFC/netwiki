---
title: "ssl_ocsp (ngx_http_ssl_module)"
description: "Directive nginx ssl_ocsp (ngx_http_ssl_module) — Active la validation OCSP de la chaîne de certificats du client. Le paramètre leaf limite la validation au seul certificat du client. Pour que la validation OCSP fonctionne, la directive…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ocsp on \| off \| leaf;` |
| **Valeur par défaut** | `ssl_ocsp off;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.19.0 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Active la validation OCSP de la chaîne de certificats du client. Le paramètre `leaf` limite la validation au seul certificat du client.

Pour que la validation OCSP fonctionne, la directive [[12-directives/ssl-verify-client-http-ssl|ssl_verify_client]] doit valoir `on` ou `optional`.

Pour résoudre le nom d'hôte du répondeur OCSP, la directive [[12-directives/resolver-http-core|resolver]] doit aussi être indiquée.

Exemple :

```nginx
ssl_verify_client on;
ssl_ocsp          on;
resolver          192.0.2.1;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ssl_stapling (ngx_http_ssl_module)"
description: "Directive nginx ssl_stapling (ngx_http_ssl_module) — Active ou désactive l'agrafage des réponses OCSP (OCSP stapling) par le serveur. Exemple : nginx ssl_stapling on; resolver 192.0.2.1; Pour que l'agrafage OCSP fonctionne, le certificat de l'émetteur…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_stapling on \| off;` |
| **Valeur par défaut** | `ssl_stapling off;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.3.7 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Active ou désactive l'[agrafage des réponses OCSP](https://datatracker.ietf.org/doc/html/rfc6066#section-8) (*OCSP stapling*) par le serveur. Exemple :

```nginx
ssl_stapling on;
resolver 192.0.2.1;
```

Pour que l'agrafage OCSP fonctionne, le certificat de l'émetteur du certificat du serveur doit être connu. Si le fichier [[12-directives/ssl-certificate-http-ssl|ssl_certificate]] ne contient pas les certificats intermédiaires, le certificat de l'émetteur doit figurer dans le fichier [[12-directives/ssl-trusted-certificate-http-ssl|ssl_trusted_certificate]].

Pour résoudre le nom d'hôte du répondeur OCSP, la directive [[12-directives/resolver-http-core|resolver]] doit aussi être indiquée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ssl_stapling_verify (ngx_http_ssl_module)"
description: "Directive nginx ssl_stapling_verify (ngx_http_ssl_module) — Active ou désactive la vérification des réponses OCSP par le serveur. Pour que la vérification fonctionne, le certificat de l'émetteur du certificat du serveur, le certificat racine et tous les…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_stapling_verify on \| off;` |
| **Valeur par défaut** | `ssl_stapling_verify off;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.3.7 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Active ou désactive la vérification des réponses OCSP par le serveur.

Pour que la vérification fonctionne, le certificat de l'émetteur du certificat du serveur, le certificat racine et tous les certificats intermédiaires doivent être déclarés de confiance avec la directive [[12-directives/ssl-trusted-certificate-http-ssl|ssl_trusted_certificate]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

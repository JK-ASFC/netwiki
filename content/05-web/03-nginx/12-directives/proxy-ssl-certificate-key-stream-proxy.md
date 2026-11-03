---
title: "proxy_ssl_certificate_key (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_certificate_key (ngx_stream_proxy_module) — On peut indiquer store:scheme:id à la place de file (1.29.0) pour charger la clé secrète d'identifiant id via le schéma d'URI scheme enregistré par un fournisseur OpenSSL, par exemple pkcs11. Indique…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_certificate_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

On peut indiquer `store`:*scheme*:*id* à la place de *file* (1.29.0) pour charger la clé secrète d'identifiant *id* via le schéma d'URI *scheme* enregistré par un fournisseur OpenSSL, par exemple [`pkcs11`](https://datatracker.ietf.org/doc/html/rfc7512).

Indique un *fichier* contenant la clé secrète au format PEM utilisée pour s'authentifier auprès d'un serveur mandaté.

Depuis la version 1.21.0, le nom de fichier (*file*) peut contenir des variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

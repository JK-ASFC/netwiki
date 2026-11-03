---
title: "ssl_crl (ngx_mail_ssl_module)"
description: "Directive nginx ssl_crl (ngx_mail_ssl_module) — Indique le fichier (file) contenant les certificats révoqués (CRL) au format PEM utilisé pour vérifier les certificats des clients. Avec des certificats intermédiaires, leurs CRL doivent figurer dans…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats révoqués (CRL) au format PEM utilisé pour [[12-directives/ssl-verify-client-mail-ssl|vérifier]] les certificats des clients. Avec des certificats intermédiaires, leurs CRL doivent figurer dans le même fichier.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

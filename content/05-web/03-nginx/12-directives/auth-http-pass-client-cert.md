---
title: "auth_http_pass_client_cert"
description: "Directive nginx auth_http_pass_client_cert (ngx_mail_auth_http_module) — Ajoute aux requêtes envoyées au serveur d'authentification l'en-tête Auth-SSL-Cert contenant le certificat du client au format PEM (encodé pour URL)."
tags: [nginx, directive, ngx_mail_auth_http_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_http_pass_client_cert on \| off;` |
| **Valeur par défaut** | `auth_http_pass_client_cert off;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/04-mail/ngx_mail_auth_http_module\|ngx_mail_auth_http_module]] |

## Utilisation

Ajoute aux requêtes envoyées au serveur d'authentification l'en-tête `Auth-SSL-Cert` contenant le certificat du [[12-directives/ssl-verify-client-mail-ssl|client]] au format PEM (encodé pour URL).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

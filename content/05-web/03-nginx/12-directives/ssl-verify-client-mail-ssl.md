---
title: "ssl_verify_client (ngx_mail_ssl_module)"
description: "Directive nginx ssl_verify_client (ngx_mail_ssl_module) — Enables verification of client certificates. The verification result is passed in the Auth-SSL-Verify header of the authentication request. The optional parameter requests the client certificate and…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_verify_client on \| off \| optional \| optional_no_ca;` |
| **Valeur par défaut** | `ssl_verify_client off;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Enables verification of client certificates. The verification result is passed in the `Auth-SSL-Verify` header of the [[12-directives/auth-http|authentication]] request.

The `optional` parameter requests the client certificate and verifies it if the certificate is present.

The `optional_no_ca` parameter requests the client certificate but does not require it to be signed by a trusted CA certificate. This is intended for the use in cases when a service that is external to nginx performs the actual certificate verification. The contents of the certificate is accessible through requests [[12-directives/auth-http-pass-client-cert|sent]] to the authentication server.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

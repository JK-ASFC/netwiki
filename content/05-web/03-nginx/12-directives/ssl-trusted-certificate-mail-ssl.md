---
title: "ssl_trusted_certificate (ngx_mail_ssl_module)"
description: "Directive nginx ssl_trusted_certificate (ngx_mail_ssl_module) — Specifies a file with trusted CA certificates in the PEM format used to verify client certificates. Contrairement au certificat défini par ssl_client_certificate, la liste de ces certificats n'est…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_trusted_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Specifies a *file* with trusted CA certificates in the PEM format used to [[12-directives/ssl-verify-client-mail-ssl|verify]] client certificates.

Contrairement au certificat défini par [[12-directives/ssl-client-certificate-mail-ssl|ssl_client_certificate]], la liste de ces certificats n'est pas envoyée aux clients.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

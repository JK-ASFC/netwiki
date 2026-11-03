---
title: "ssl_client_certificate (ngx_mail_ssl_module)"
description: "Directive nginx ssl_client_certificate (ngx_mail_ssl_module) — Specifies a file with trusted CA certificates in the PEM format used to verify client certificates. La liste des certificats est envoyée aux clients. Si ce n'est pas souhaité, on peut utiliser la…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_client_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Specifies a *file* with trusted CA certificates in the PEM format used to [[12-directives/ssl-verify-client-mail-ssl|verify]] client certificates.

La liste des certificats est envoyée aux clients. Si ce n'est pas souhaité, on peut utiliser la directive [[12-directives/ssl-trusted-certificate-mail-ssl|ssl_trusted_certificate]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

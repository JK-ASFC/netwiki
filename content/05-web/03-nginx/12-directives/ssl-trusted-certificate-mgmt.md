---
title: "ssl_trusted_certificate (ngx_mgmt_module)"
description: "Directive nginx ssl_trusted_certificate (ngx_mgmt_module) — Specifies a file with trusted CA certificates in the PEM format used to verify the certificate of the usage reporting endpoint."
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_trusted_certificate file;` |
| **Valeur par défaut** | `ssl_trusted_certificate system CA bundle;` |
| **Contexte** | `mgmt` |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Specifies a *file* with trusted CA certificates in the PEM format used to [[12-directives/ssl-verify-mgmt|verify]] the certificate of the usage reporting endpoint.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ssl_crl (ngx_mgmt_module)"
description: "Directive nginx ssl_crl (ngx_mgmt_module) — Specifies a file with revoked certificates (CRL) in the PEM format used to verify the certificate of the usage reporting endpoint. When using intermediate certificates, their CRLs should be specified…"
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `mgmt` |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Specifies a *file* with revoked certificates (CRL) in the PEM format used to [[12-directives/ssl-verify-mgmt|verify]] the certificate of the usage reporting endpoint. When using intermediate certificates, their CRLs should be specified in the same file.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

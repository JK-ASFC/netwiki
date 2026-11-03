---
title: "common_name_in_csr"
description: "Directive nginx common_name_in_csr (ngx_http_acme_module) — If enabled, sets the Subject Common Name in the certificate request to the first DNS name or the first IP address provided. NOTE Enabling this option may result in rejected certificate requests. NOTE…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `common_name_in_csr on \| off;` |
| **Valeur par défaut** | `common_name_in_csr off;` |
| **Contexte** | `acme_issuer` |
| **Apparue dans la version** | 0.4.0 |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

If enabled, sets the Subject Common Name in the certificate request to the first DNS name or the first IP address provided.

> [!NOTE]
> Enabling this option may result in rejected certificate requests.

> [!NOTE]
> Prior to version 0.4.0, the Subject Common Name was always set.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

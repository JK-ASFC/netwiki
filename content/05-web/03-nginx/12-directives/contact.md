---
title: "contact"
description: "Directive nginx contact (ngx_http_acme_module) — Sets an array of URLs that the ACME server can use to contact the client regarding account issues. The mailto: scheme will be used unless specified explicitly."
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `contact URL;` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Sets an array of URLs that the ACME server can use to contact the client regarding account issues. The `mailto:` scheme will be used unless specified explicitly.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

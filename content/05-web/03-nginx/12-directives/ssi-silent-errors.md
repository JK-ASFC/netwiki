---
title: "ssi_silent_errors"
description: "Directive nginx ssi_silent_errors (ngx_http_ssi_module) — If enabled, suppresses the output of the “an error occurred while processing the directive” string if an error occurred during SSI processing."
tags: [nginx, directive, ngx_http_ssi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssi_silent_errors on \| off;` |
| **Valeur par défaut** | `ssi_silent_errors off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_ssi_module\|ngx_http_ssi_module]] |

## Utilisation

If enabled, suppresses the output of the “`[an error occurred while processing the directive]`” string if an error occurred during SSI processing.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

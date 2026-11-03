---
title: "quic_retry"
description: "Directive nginx quic_retry (ngx_http_v3_module) — Enables the QUIC Address Validation feature. This includes sending a new token in a Retry packet or a NEW_TOKEN frame and validating a token received in the Initial packet."
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `quic_retry on \| off;` |
| **Valeur par défaut** | `quic_retry off;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Enables the [QUIC Address Validation](https://datatracker.ietf.org/doc/html/rfc9000#name-address-validation) feature. This includes sending a new token in a `Retry` packet or a `NEW_TOKEN` frame and validating a token received in the `Initial` packet.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

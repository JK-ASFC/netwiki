---
title: "quic_host_key"
description: "Directive nginx quic_host_key (ngx_http_v3_module) — Sets a file with the secret key used to encrypt stateless reset and address validation tokens. By default, a random key is generated on each reload. Tokens generated with old keys are not accepted."
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `quic_host_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Sets a *file* with the secret key used to encrypt stateless reset and address validation tokens. By default, a random key is generated on each reload. Tokens generated with old keys are not accepted.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

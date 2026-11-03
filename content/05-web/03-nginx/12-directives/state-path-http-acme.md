---
title: "state_path (ngx_http_acme_module)"
description: "Directive nginx state_path (ngx_http_acme_module) — Defines a directory for storing the module data that can be persisted across restarts. This can improve the load time by skipping some requests on startup, and avoid hitting request rate limits on…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `state_path path \| off;` |
| **Valeur par défaut** | `state_path acme_<issuer>;` |
| **Contexte** | `acme_issuer` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Defines a directory for storing the module data that can be persisted across restarts. This can improve the load time by skipping some requests on startup, and avoid hitting request rate limits on the ACME server.

The directory contains sensitive content, such as the account key, issued certificates, and private keys.

The `off` parameter (0.2.0) disables storing the account information and issued certificates on disk.

> [!NOTE]
> Prior to version 0.2.0, the state directory was not created by default.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

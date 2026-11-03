---
title: "ssl_ech_file (ngx_http_ssl_module)"
description: "Directive nginx ssl_ech_file (ngx_http_ssl_module) — Specifies a file with encrypted ClientHello configuration (ECHConfig) in the PEM format used to enable TLS 1.3 ECH in shared mode. NOTE The directive is supported when using OpenSSL 4.0 or higher."
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ech_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.29.4 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Specifies a *file* with encrypted ClientHello configuration (`ECHConfig`) in the [PEM](https://datatracker.ietf.org/doc/html/rfc9934) format used to enable TLS 1.3 [ECH](https://datatracker.ietf.org/doc/html/rfc9849) in shared mode.

> [!NOTE]
> The directive is supported when using OpenSSL 4.0 or higher.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

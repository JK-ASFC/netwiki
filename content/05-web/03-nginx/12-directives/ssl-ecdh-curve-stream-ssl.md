---
title: "ssl_ecdh_curve (ngx_stream_ssl_module)"
description: "Directive nginx ssl_ecdh_curve (ngx_stream_ssl_module) — Specifies a curve for ECDHE ciphers. When using OpenSSL 1.0.2 or higher, it is possible to specify multiple curves (1.11.0), for example: nginx ssl_ecdh_curve prime256v1:secp384r1; The special value…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ecdh_curve curve;` |
| **Valeur par défaut** | `ssl_ecdh_curve auto;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Specifies a *curve* for ECDHE ciphers.

When using OpenSSL 1.0.2 or higher, it is possible to specify multiple curves (1.11.0), for example:

```nginx
ssl_ecdh_curve prime256v1:secp384r1;
```

The special value `auto` (1.11.0) instructs nginx to use a list built into the OpenSSL library when using OpenSSL 1.0.2 or higher, or `prime256v1` with older versions.

> [!NOTE]
> Prior to version 1.11.0, the `prime256v1` curve was used by default.

> [!NOTE]
> When using OpenSSL 1.0.2 or higher, this directive sets the list of curves supported by the server. Thus, in order for ECDSA certificates to work, it is important to include the curves used in the certificates.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

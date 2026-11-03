---
title: "ssl_ciphers (ngx_stream_ssl_module)"
description: "Directive nginx ssl_ciphers (ngx_stream_ssl_module) — Indique les suites de chiffrement activées, au format reconnu par la bibliothèque OpenSSL, par exemple : nginx ssl_ciphers ALL:aNULL:EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP; La liste complète…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ciphers ciphers;` |
| **Valeur par défaut** | `ssl_ciphers HIGH:!aNULL:!MD5;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Indique les suites de chiffrement activées, au format reconnu par la bibliothèque OpenSSL, par exemple :

```nginx
ssl_ciphers ALL:!aNULL:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
```

La liste complète s'affiche avec la commande « `openssl ciphers` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

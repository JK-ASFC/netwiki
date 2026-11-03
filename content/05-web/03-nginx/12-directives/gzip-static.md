---
title: "gzip_static"
description: "Directive nginx gzip_static (ngx_http_gzip_static_module) — Enables (“on”) or disables (“off”) checking the existence of precompressed files. The following directives are also taken into account: gzip_http_version, gzip_proxied, gzip_disable, and gzip_vary.…"
tags: [nginx, directive, ngx_http_gzip_static_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_static on \| off \| always;` |
| **Valeur par défaut** | `gzip_static off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_static_module\|ngx_http_gzip_static_module]] |

## Utilisation

Enables (“`on`”) or disables (“`off`”) checking the existence of precompressed files. The following directives are also taken into account: [[12-directives/gzip-http-version|gzip_http_version]], [[12-directives/gzip-proxied|gzip_proxied]], [[12-directives/gzip-disable|gzip_disable]], and [[12-directives/gzip-vary|gzip_vary]].

With the “`always`” value (1.3.6), gzipped file is used in all cases, without checking if the client supports it. It is useful if there are no uncompressed files on the disk anyway or the [[11-modules/02-http/ngx_http_gunzip_module|ngx_http_gunzip_module]] is used.

The files can be compressed using the `gzip` command, or any other compatible one. It is recommended that the modification date and time of original and compressed files be the same.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

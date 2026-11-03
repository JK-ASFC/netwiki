---
title: "geoip_country (ngx_http_geoip_module)"
description: "Directive nginx geoip_country (ngx_http_geoip_module) — Specifies a database used to determine the country depending on the client IP address. The following variables are available when using this database: - $geoip_country_code two-letter country code,…"
tags: [nginx, directive, ngx_http_geoip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geoip_country file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_geoip_module\|ngx_http_geoip_module]] |

## Utilisation

Specifies a database used to determine the country depending on the client IP address. The following variables are available when using this database:

- **`$geoip_country_code`**

  two-letter country code, for example, “`RU`”, “`US`”.

- **`$geoip_country_code3`**

  three-letter country code, for example, “`RUS`”, “`USA`”.

- **`$geoip_country_name`**

  country name, for example, “`Russian Federation`”, “`United States`”.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

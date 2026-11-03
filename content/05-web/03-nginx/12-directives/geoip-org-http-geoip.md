---
title: "geoip_org (ngx_http_geoip_module)"
description: "Directive nginx geoip_org (ngx_http_geoip_module) — Specifies a database used to determine the organization depending on the client IP address. The following variable is available when using this database: - $geoip_org organization name, for example,…"
tags: [nginx, directive, ngx_http_geoip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geoip_org file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Apparue dans la version** | 1.0.3 |
| **Module** | [[11-modules/02-http/ngx_http_geoip_module\|ngx_http_geoip_module]] |

## Utilisation

Specifies a database used to determine the organization depending on the client IP address. The following variable is available when using this database:

- **`$geoip_org`**

  organization name, for example, “The University of Melbourne”.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

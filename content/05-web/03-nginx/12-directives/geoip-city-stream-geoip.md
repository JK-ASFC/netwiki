---
title: "geoip_city (ngx_stream_geoip_module)"
description: "Directive nginx geoip_city (ngx_stream_geoip_module) — Specifies a database used to determine the country, region, and city depending on the client IP address. The following variables are available when using this database: - $geoip_area_code telephone…"
tags: [nginx, directive, ngx_stream_geoip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geoip_city file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_geoip_module\|ngx_stream_geoip_module]] |

## Utilisation

Specifies a database used to determine the country, region, and city depending on the client IP address. The following variables are available when using this database:

- **`$geoip_area_code`**

  telephone area code (US only).

  > [!NOTE]
  > This variable may contain outdated information since the corresponding database field is deprecated.

- **`$geoip_city_continent_code`**

  two-letter continent code, for example, “`EU`”, “`NA`”.

- **`$geoip_city_country_code`**

  two-letter country code, for example, “`RU`”, “`US`”.

- **`$geoip_city_country_code3`**

  three-letter country code, for example, “`RUS`”, “`USA`”.

- **`$geoip_city_country_name`**

  country name, for example, “`Russian Federation`”, “`United States`”.

- **`$geoip_dma_code`**

  DMA region code in US (also known as “metro code”), according to the [geotargeting](https://developers.google.com/adwords/api/docs/appendix/cities-DMAregions) in Google AdWords API.

  > [!NOTE]
  > This variable may contain outdated information since the corresponding database field is deprecated.

- **`$geoip_latitude`**

  latitude.

- **`$geoip_longitude`**

  longitude.

- **`$geoip_region`**

  country region code (region, territory, state, province, federal land and the like).

- **`$geoip_region_name`**

  country region name (region, territory, state, province, federal land and the like), for example, “`Moscow City`”, “`District of Columbia`”.

- **`$geoip_city`**

  city name, for example, “`Moscow`”, “`Washington`”.

- **`$geoip_postal_code`**

  postal code.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

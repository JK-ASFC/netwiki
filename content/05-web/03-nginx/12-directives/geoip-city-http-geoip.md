---
title: "geoip_city (ngx_http_geoip_module)"
description: "Directive nginx geoip_city (ngx_http_geoip_module) — Indique la base utilisée pour déterminer le pays, la région et la ville selon l'adresse IP du client. Les variables suivantes sont alors disponibles : - $geoip_area_code indicatif téléphonique…"
tags: [nginx, directive, ngx_http_geoip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geoip_city file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_geoip_module\|ngx_http_geoip_module]] |

## Utilisation

Indique la base utilisée pour déterminer le pays, la région et la ville selon l'adresse IP du client. Les variables suivantes sont alors disponibles :

- **`$geoip_area_code`**

  indicatif téléphonique régional (États-Unis uniquement).

  > [!NOTE]
  > Cette variable peut contenir des informations obsolètes, car le champ correspondant de la base est abandonné.

- **`$geoip_city_continent_code`**

  code de continent à deux lettres, par exemple « `EU` », « `NA` ».

- **`$geoip_city_country_code`**

  code de pays à deux lettres, par exemple « `RU` », « `US` ».

- **`$geoip_city_country_code3`**

  code de pays à trois lettres, par exemple « `RUS` », « `USA` ».

- **`$geoip_city_country_name`**

  nom du pays, par exemple « `Russian Federation` », « `United States` ».

- **`$geoip_dma_code`**

  code de région DMA aux États-Unis (aussi appelé « metro code »), selon le [ciblage géographique](https://developers.google.com/adwords/api/docs/appendix/cities-DMAregions) de l'API Google AdWords.

  > [!NOTE]
  > Cette variable peut contenir des informations obsolètes, car le champ correspondant de la base est abandonné.

- **`$geoip_latitude`**

  latitude.

- **`$geoip_longitude`**

  longitude.

- **`$geoip_region`**

  code de la région du pays (région, territoire, État, province, Land, etc.).

- **`$geoip_region_name`**

  nom de la région du pays (région, territoire, État, province, Land, etc.), par exemple « `Moscow City` », « `District of Columbia` ».

- **`$geoip_city`**

  nom de la ville, par exemple « `Moscow` », « `Washington` ».

- **`$geoip_postal_code`**

  code postal.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

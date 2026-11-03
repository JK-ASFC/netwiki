---
title: "ngx_stream_geoip_module"
description: "Module nginx ngx_stream_geoip_module — The ngx_stream_geoip_module module (1.11.3) creates variables with values depending on the client IP address, using the precompiled MaxMind databases. Since 1.31.7, the module supports databases in MaxMind DB (MMDB)…"
tags: [nginx, module, ngx_stream_geoip_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_geoip_module` module (1.11.3) creates variables with values depending on the client IP address, using the precompiled [MaxMind](https://www.maxmind.com) databases. Since 1.31.7, the module supports databases in MaxMind DB (MMDB) format.

This module is not built by default, it should be enabled with the [[10-guides/01-introduction/configure|--with-stream_geoip_module]] configuration parameter.

> [!NOTE]
> This module requires the [libmaxminddb](https://github.com/maxmind/libmaxminddb) library for databases in MMDB format (1.31.7) or [GeoIP Legacy C](https://github.com/maxmind/geoip-api-c) library for databases in DAT format.

When using DAT databases with IPv6 support, IPv4 addresses are looked up as IPv4-mapped IPv6 addresses. When using MMDB databases, IPv4-mapped IPv6 addresses are looked up as IPv4 addresses.

## Exemple de configuration

```nginx
stream {
    geoip_country         GeoLite2-Country.mmdb;
    geoip_city            GeoLite2-City.mmdb;

    map $geoip_city_continent_code $nearest_server {
        default        example.com;
        EU          eu.example.com;
        NA          na.example.com;
        AS          as.example.com;
    }
   ...
}
```

## Directives

- [[12-directives/geoip-country-stream-geoip|geoip_country]]
- [[12-directives/geoip-city-stream-geoip|geoip_city]]
- [[12-directives/geoip-org-stream-geoip|geoip_org]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ngx_http_geoip_module"
description: "Module nginx ngx_http_geoip_module — The ngx_http_geoip_module module (0.8.6+) creates variables with values depending on the client IP address, using the precompiled MaxMind databases. Since 1.31.7, the module supports databases in MaxMind DB (MMDB)…"
tags: [nginx, module, ngx_http_geoip_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_geoip_module` module (0.8.6+) creates variables with values depending on the client IP address, using the precompiled [MaxMind](https://www.maxmind.com) databases. Since 1.31.7, the module supports databases in MaxMind DB (MMDB) format.

This module is not built by default, it should be enabled with the [[10-guides/01-introduction/configure|--with-http_geoip_module]] configuration parameter.

> [!NOTE]
> This module requires the [libmaxminddb](https://github.com/maxmind/libmaxminddb) library for databases in MMDB format (1.31.7) or [GeoIP Legacy C](https://github.com/maxmind/geoip-api-c) library for databases in DAT format.

When using DAT databases with IPv6 support (1.3.12, 1.2.7), IPv4 addresses are looked up as IPv4-mapped IPv6 addresses. When using MMDB databases, IPv4-mapped IPv6 addresses are looked up as IPv4 addresses.

## Exemple de configuration

```nginx
http {
    geoip_country         GeoLite2-Country.mmdb;
    geoip_city            GeoLite2-City.mmdb;
    geoip_org             GeoLite2-ASN.mmdb;
    geoip_proxy           192.168.100.0/24;
    geoip_proxy           2001:0db8::/32;
    geoip_proxy_recursive on;
    ...
```

## Directives

- [[12-directives/geoip-country-http-geoip|geoip_country]]
- [[12-directives/geoip-city-http-geoip|geoip_city]]
- [[12-directives/geoip-org-http-geoip|geoip_org]]
- [[12-directives/geoip-proxy|geoip_proxy]]
- [[12-directives/geoip-proxy-recursive|geoip_proxy_recursive]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

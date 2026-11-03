---
title: "ngx_stream_geoip_module"
description: "Module nginx ngx_stream_geoip_module — Le module ngx_stream_geoip_module (1.11.3) crée des variables dont les valeurs dépendent de l'adresse IP du client, à l'aide des bases MaxMind précompilées. Depuis la version 1.31.7, le module prend en charge les bases…"
tags: [nginx, module, ngx_stream_geoip_module]
icon: puzzle
---

Le module `ngx_stream_geoip_module` (1.11.3) crée des variables dont les valeurs dépendent de l'adresse IP du client, à l'aide des bases [MaxMind](https://www.maxmind.com) précompilées. Depuis la version 1.31.7, le module prend en charge les bases au format MaxMind DB (MMDB).

Ce module n'est pas compilé par défaut ; activez-le avec le paramètre de configuration [[10-guides/01-introduction/configure|--with-stream_geoip_module]].

> [!NOTE]
> Ce module nécessite la bibliothèque [libmaxminddb](https://github.com/maxmind/libmaxminddb) pour les bases au format MMDB (1.31.7) ou la bibliothèque [GeoIP Legacy C](https://github.com/maxmind/geoip-api-c) pour les bases au format DAT.

Avec des bases DAT prenant en charge IPv6, les adresses IPv4 sont recherchées comme adresses IPv6 mappées IPv4. Avec des bases MMDB, les adresses IPv6 mappées IPv4 sont recherchées comme adresses IPv4.

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

---
title: "ngx_http_geoip_module"
description: "Module nginx ngx_http_geoip_module — Le module ngx_http_geoip_module (0.8.6+) crée des variables dont la valeur dépend de l'adresse IP du client, à l'aide des bases de données précompilées de MaxMind. Depuis la version 1.31.7, il prend en charge les bases…"
tags: [nginx, module, ngx_http_geoip_module]
icon: puzzle
---

Le module `ngx_http_geoip_module` (0.8.6+) crée des variables dont la valeur dépend de l'adresse IP du client, à l'aide des bases de données précompilées de [MaxMind](https://www.maxmind.com). Depuis la version 1.31.7, il prend en charge les bases au format MaxMind DB (MMDB).

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration [[10-guides/01-introduction/configure|--with-http_geoip_module]].

> [!NOTE]
> Ce module nécessite la bibliothèque [libmaxminddb](https://github.com/maxmind/libmaxminddb) pour les bases au format MMDB (1.31.7) ou la bibliothèque [GeoIP Legacy C](https://github.com/maxmind/geoip-api-c) pour les bases au format DAT.

Avec les bases DAT prenant en charge IPv6 (1.3.12, 1.2.7), les adresses IPv4 sont recherchées sous forme d'adresses IPv6 mappées IPv4. Avec les bases MMDB, les adresses IPv6 mappées IPv4 sont recherchées comme des adresses IPv4.

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

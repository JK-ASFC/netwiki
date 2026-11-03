---
title: "geo (ngx_stream_geo_module)"
description: "Directive nginx geo (ngx_stream_geo_module) — Describes the dependency of values of the specified variable on the client IP address. By default, the address is taken from the $remote_addr variable, but it can also be taken from another variable,…"
tags: [nginx, directive, ngx_stream_geo_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geo [$address] $variable { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_geo_module\|ngx_stream_geo_module]] |

## Utilisation

Describes the dependency of values of the specified variable on the client IP address. By default, the address is taken from the `$remote_addr` variable, but it can also be taken from another variable, for example:

```nginx
geo $arg_remote_addr $geo {
    ...;
}
```

> [!NOTE]
> Since variables are evaluated only when used, the mere existence of even a large number of declared “`geo`” variables does not cause any extra costs for connection processing.

If the value of a variable does not represent a valid IP address then the “`255.255.255.255`” address is used.

Addresses are specified either as prefixes in CIDR notation (including individual addresses) or as ranges.

Les paramètres spéciaux suivants sont aussi pris en charge :

- **`delete`**

  deletes the specified network.

- **`default`**

  a value set to the variable if the client address does not match any of the specified addresses. When addresses are specified in CIDR notation, “`0.0.0.0/0`” and “`::/0`” can be used instead of `default`. When `default` is not specified, the default value will be an empty string.

- **`include`**

  includes a file with addresses and values. There can be several inclusions.

- **`ranges`**

  indicates that addresses are specified as ranges. This parameter should be the first. To speed up loading of a geo base, addresses should be put in ascending order.

- **`volatile`**

  indicates that the variable is not cacheable (1.29.3).

Exemple :

```nginx
geo $country {
    default        ZZ;
    include        conf/geo.conf;
    delete         127.0.0.0/16;

    127.0.0.0/24   US;
    127.0.0.1/32   RU;
    10.1.0.0/16    RU;
    192.168.1.0/24 UK;
}
```

The `conf/geo.conf` file could contain the following lines:

```nginx
10.2.0.0/16    RU;
192.168.2.0/24 RU;
```

A value of the most specific match is used. For example, for the 127.0.0.1 address the value “`RU`” will be chosen, not “`US`”.

Example with ranges:

```nginx
geo $country {
    ranges;
    default                   ZZ;
    127.0.0.0-127.0.0.0       US;
    127.0.0.1-127.0.0.1       RU;
    127.0.0.1-127.0.0.255     US;
    10.1.0.0-10.1.255.255     RU;
    192.168.1.0-192.168.1.255 UK;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

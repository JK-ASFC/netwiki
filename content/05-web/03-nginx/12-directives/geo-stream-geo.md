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

Si la valeur d'une variable n'est pas une adresse IP valide, l'adresse « `255.255.255.255` » est utilisée.

Addresses are specified either as prefixes in CIDR notation (including individual addresses) or as ranges.

Les paramètres spéciaux suivants sont aussi pris en charge :

- **`delete`**

  deletes the specified network.

- **`default`**

  valeur affectée à la variable si l'adresse du client ne correspond à aucune des adresses indiquées. En notation CIDR, on peut utiliser « `0.0.0.0/0` » et « `::/0` » au lieu de `default`. Sans `default`, la valeur par défaut est une chaîne vide.

- **`include`**

  inclut un fichier d'adresses et de valeurs. Il peut y avoir plusieurs inclusions.

- **`ranges`**

  indicates that addresses are specified as ranges. This parameter should be the first. To speed up loading of a geo base, addresses should be put in ascending order.

- **`volatile`**

  indique que la variable ne peut pas être mise en cache (1.29.3).

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

Le fichier `conf/geo.conf` peut contenir les lignes suivantes :

```nginx
10.2.0.0/16    RU;
192.168.2.0/24 RU;
```

La valeur de la correspondance la plus précise est utilisée. Par exemple, pour l'adresse 127.0.0.1, c'est la valeur « `RU` » qui est choisie, et non « `US` ».

Exemple avec des plages :

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

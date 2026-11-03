---
title: "geo (ngx_stream_geo_module)"
description: "Directive nginx geo (ngx_stream_geo_module) — Décrit la dépendance des valeurs de la variable indiquée vis-à-vis de l'adresse IP du client. Par défaut, l'adresse est prise dans la variable $remote_addr, mais elle peut aussi venir d'une autre…"
tags: [nginx, directive, ngx_stream_geo_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geo [$address] $variable { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_geo_module\|ngx_stream_geo_module]] |

## Utilisation

Décrit la dépendance des valeurs de la variable indiquée vis-à-vis de l'adresse IP du client. Par défaut, l'adresse est prise dans la variable `$remote_addr`, mais elle peut aussi venir d'une autre variable, par exemple :

```nginx
geo $arg_remote_addr $geo {
    ...;
}
```

> [!NOTE]
> Comme les variables ne sont évaluées qu'à leur utilisation, la simple existence d'un grand nombre de variables « `geo` » déclarées n'entraîne aucun coût supplémentaire pour le traitement des connexions.

Si la valeur d'une variable n'est pas une adresse IP valide, l'adresse « `255.255.255.255` » est utilisée.

Les adresses s'indiquent soit sous forme de préfixes en notation CIDR (y compris des adresses individuelles), soit sous forme de plages.

Les paramètres spéciaux suivants sont aussi pris en charge :

- **`delete`**

  supprime le réseau indiqué.

- **`default`**

  valeur affectée à la variable si l'adresse du client ne correspond à aucune des adresses indiquées. En notation CIDR, on peut utiliser « `0.0.0.0/0` » et « `::/0` » au lieu de `default`. Sans `default`, la valeur par défaut est une chaîne vide.

- **`include`**

  inclut un fichier d'adresses et de valeurs. Il peut y avoir plusieurs inclusions.

- **`ranges`**

  indique que les adresses sont données sous forme de plages. Ce paramètre doit être le premier. Pour accélérer le chargement d'une base geo, placez les adresses dans l'ordre croissant.

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

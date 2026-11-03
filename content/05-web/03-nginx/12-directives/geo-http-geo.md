---
title: "geo (ngx_http_geo_module)"
description: "Directive nginx geo (ngx_http_geo_module) — Décrit la dépendance entre les valeurs de la variable indiquée et l'adresse IP du client. Par défaut, l'adresse est prise dans la variable $remote_addr, mais elle peut aussi l'être dans une autre…"
tags: [nginx, directive, ngx_http_geo_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `geo [$address] $variable { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_geo_module\|ngx_http_geo_module]] |

## Utilisation

Décrit la dépendance entre les valeurs de la variable indiquée et l'adresse IP du client. Par défaut, l'adresse est prise dans la variable `$remote_addr`, mais elle peut aussi l'être dans une autre variable (0.7.27), par exemple :

```nginx
geo $arg_remote_addr $geo {
    ...;
}
```

> [!NOTE]
> Comme les variables ne sont évaluées que lorsqu'elles sont utilisées, la simple existence d'un grand nombre de variables « `geo` » déclarées n'ajoute aucun coût au traitement des requêtes.

Si la valeur d'une variable n'est pas une adresse IP valide, l'adresse « `255.255.255.255` » est utilisée.

Les adresses s'indiquent soit sous forme de préfixes en notation CIDR (adresses individuelles comprises), soit sous forme de plages (0.7.23).

> [!NOTE]
> Les préfixes IPv6 sont pris en charge à partir des versions 1.3.10 et 1.2.7.

Les paramètres spéciaux suivants sont aussi pris en charge :

- **`delete`**

  supprime le réseau indiqué (0.7.23).

- **`default`**

  valeur affectée à la variable si l'adresse du client ne correspond à aucune des adresses indiquées. En notation CIDR, on peut utiliser « `0.0.0.0/0` » et « `::/0` » au lieu de `default`. Sans `default`, la valeur par défaut est une chaîne vide.

- **`include`**

  inclut un fichier d'adresses et de valeurs. Il peut y avoir plusieurs inclusions.

- **`proxy`**

  définit les adresses de confiance (0.8.7, 0.7.63). Lorsqu'une requête provient d'une adresse de confiance, c'est l'adresse du champ d'en-tête de requête `X-Forwarded-For` qui est utilisée. Contrairement aux adresses ordinaires, les adresses de confiance sont vérifiées dans l'ordre.

  > [!NOTE]
  > Les adresses IPv6 de confiance sont prises en charge à partir des versions 1.3.0 et 1.2.1.

- **`proxy_recursive`**

  active la recherche récursive d'adresse (1.3.0, 1.2.1). Si elle est désactivée, l'adresse d'origine du client qui correspond à une adresse de confiance est remplacée par la dernière adresse transmise dans `X-Forwarded-For`. Si elle est activée, elle est remplacée par la dernière adresse non fiable transmise dans `X-Forwarded-For`.

- **`ranges`**

  indique que les adresses sont des plages (0.7.23). Ce paramètre doit figurer en premier. Pour accélérer le chargement d'une base geo, les adresses doivent être classées par ordre croissant.

- **`volatile`**

  indique que la variable ne peut pas être mise en cache (1.29.3).

Exemple :

```nginx
geo $country {
    default        ZZ;
    include        conf/geo.conf;
    delete         127.0.0.0/16;
    proxy          192.168.100.0/24;
    proxy          2001:0db8::/32;

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

---
title: "Captures des expressions régulières"
description: "Nginx — Captures des expressions régulières. Les expressions régulières utilisées dans les directives location, server_name, if, map et quelques autres peuvent contenir des captures. Une sous-chaîne capturée est désignée soit par sa position, « $1 »...« $9 », soit…"
tags: [nginx, guide]
icon: book-open
---

Les expressions régulières utilisées dans les directives [[12-directives/location|location]], [[12-directives/server-name-http-core|server_name]], [[12-directives/if|if]], [[12-directives/map-http-map|map]] et quelques autres peuvent contenir des captures. Une sous-chaîne capturée est désignée soit par sa position, « `$1` »...« `$9` », soit par son nom. Les deux formes diffèrent par la durée pendant laquelle la valeur capturée reste disponible.

Tout ce qui suit s'applique aussi aux directives [[12-directives/server-name-stream-core|server_name]] et [[12-directives/map-stream-map|map]] du module stream.

## Captures positionnelles

Les captures positionnelles sont numérotées dans l'ordre d'apparition des groupes capturants dans l'expression régulière :

```
location ~ ^/images/(.*)\.([a-z]+)$ {
    # for the "/images/cats/tom.jpg" request
    # $1 is "cats/tom" and $2 is "jpg"
}
```

Les captures positionnelles ne sont pas des variables. Elles forment un ensemble unique de valeurs, partagé par toutes ces directives pendant le traitement d'une requête ou d'une connexion. Une correspondance réussie remplace l'ensemble entier, et un échec peut le vider. Les valeurs ne restent donc disponibles que jusqu'à la correspondance suivante, qui peut avoir lieu dans une directive sans rapport.

Une correspondance peut aussi se produire implicitement. Comme les variables ne sont évaluées qu'à leur utilisation, faire référence à une variable [[12-directives/map-http-map|map]] dont les valeurs sources sont des expressions régulières les évalue à ce moment, et une correspondance réussie remplace les captures positionnelles :

```
map $uri $mapped {
    ~^/(?<first>[^/]+)/  $first;
}

location ~ ^/images/(.*)$ {
    set $name   $1;   # "cats/tom.jpg"
    set $m      $mapped;     # "images"
    set $name2  $1;   # "images", not "cats/tom.jpg"
}
```

## Captures nommées

Une capture peut recevoir un nom :

```
location ~ ^/images/(?<name>.*)\.(?<ext>[a-z]+)$ {
    ...
}
```

Les captures nommées créent des variables nginx ordinaires, ici `$name` et `$ext`. Leurs valeurs ne sont pas remplacées quand une autre expression régulière correspond, sauf si elle utilise le même nom de capture. Les captures nommées sont donc le moyen recommandé de transmettre une valeur capturée à une autre directive que celle qui a effectué la correspondance.

La bibliothèque PCRE prend en charge les captures nommées avec la syntaxe suivante :

|   |   |
| --- | --- |
| `?<name>` | Syntaxe compatible Perl |
| `?'name'` | Syntaxe compatible Perl |
| `?P<name>` | Syntaxe compatible Python |

## Conserver une capture positionnelle

Si une capture positionnelle est nécessaire plus tard et ne peut pas être remplacée par une capture nommée, copiez sa valeur dans une variable juste après la correspondance, avec la directive [[12-directives/set-http-rewrite|set]] ([[12-directives/set-stream-set|set]] dans le module stream) :

```
location ~ ^/images/(.*)$ {
    set $name $1;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

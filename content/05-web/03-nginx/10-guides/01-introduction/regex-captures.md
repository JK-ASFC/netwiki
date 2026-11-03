---
title: "Regular expression captures"
description: "Nginx — Regular expression captures. Regular expressions used in the location, server_name, if, map, and several other directives can contain captures. A captured substring is referred to either positionally, as “$1”...“$9”, or by name. The two forms…"
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

Regular expressions used in the [[12-directives/location|location]], [[12-directives/server-name-http-core|server_name]], [[12-directives/if|if]], [[12-directives/map-http-map|map]], and several other directives can contain captures. A captured substring is referred to either positionally, as “`$1`”...“`$9`”, or by name. The two forms differ in how long the captured value stays available.

Everything described below also applies to the [[12-directives/server-name-stream-core|server_name]] and [[12-directives/map-stream-map|map]] directives of the stream module.

## Positional captures

Positional captures are numbered in the order the capturing groups appear in a regular expression:

```
location ~ ^/images/(.*)\.([a-z]+)$ {
    # for the "/images/cats/tom.jpg" request
    # $1 is "cats/tom" and $2 is "jpg"
}
```

Positional captures are not variables. They form a single set of values shared by all these directives while a request or a connection is processed. A successful match replaces the whole set, and an unsuccessful match may clear it. The values therefore remain available only until the next match, which may happen in an unrelated directive.

A match may also happen implicitly. Since variables are evaluated only when they are used, referring to a [[12-directives/map-http-map|map]] variable with regular expressions in source values matches them at that moment, and a successful match replaces the positional captures:

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

## Named captures

A capture can be given a name:

```
location ~ ^/images/(?<name>.*)\.(?<ext>[a-z]+)$ {
    ...
}
```

Named captures create ordinary nginx variables, in this case `$name` and `$ext`. Their values are not replaced when another regular expression is matched, unless it uses the same capture name. This makes named captures the preferred way to pass a captured value to a directive other than the one that has performed the match.

The PCRE library supports named captures using the following syntax:

|   |   |
| --- | --- |
| `?<name>` | Perl compatible syntax |
| `?'name'` | Perl compatible syntax |
| `?P<name>` | Python compatible syntax |

## Preserving a positional capture

If a positional capture is needed later and cannot be replaced with a named one, its value should be copied into a variable right after the match, using the [[12-directives/set-http-rewrite|set]] directive ([[12-directives/set-stream-set|set]] in the stream module):

```
location ~ ^/images/(.*)$ {
    set $name $1;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

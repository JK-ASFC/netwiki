---
title: "limit_conn_zone (ngx_http_limit_conn_module)"
description: "Directive nginx limit_conn_zone (ngx_http_limit_conn_module) — Définit les paramètres d'une zone de mémoire partagée qui conserve l'état de différentes clés. L'état contient notamment le nombre actuel de connexions. La clé (key) peut contenir du texte, des…"
tags: [nginx, directive, ngx_http_limit_conn_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_conn_zone key zone=name:size;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_limit_conn_module\|ngx_http_limit_conn_module]] |

## Utilisation

Définit les paramètres d'une zone de mémoire partagée qui conserve l'état de différentes clés. L'état contient notamment le nombre actuel de connexions. La clé (*key*) peut contenir du texte, des variables ou une combinaison des deux. Les requêtes dont la clé est vide ne sont pas comptabilisées.

> [!NOTE]
> Avant la version 1.7.6, une clé (*key*) devait contenir exactement une variable.

Exemple d'utilisation :

```nginx
limit_conn_zone $binary_remote_addr zone=addr:10m;
```

Ici, l'adresse IP du client sert de clé. Notez qu'on utilise la variable `$binary_remote_addr` au lieu de `$remote_addr`. La taille de `$remote_addr` peut varier de 7 à 15 octets ; un état occupe alors 32 ou 64 octets de mémoire sur les plates-formes 32 bits et toujours 64 octets sur les plates-formes 64 bits. La taille de `$binary_remote_addr` est toujours de 4 octets pour une adresse IPv4 et de 16 octets pour une adresse IPv6 ; un état occupe toujours 32 ou 64 octets sur les plates-formes 32 bits et 64 octets sur les plates-formes 64 bits. Une zone d'un mégaoctet peut contenir environ 32 000 états de 32 octets ou environ 16 000 états de 64 octets. Lorsque la zone est pleine, le serveur renvoie une [[12-directives/limit-conn-status|erreur]] à toutes les requêtes suivantes.

> [!NOTE]
> En outre, dans le cadre de notre [abonnement commercial](https://nginx.com/products/), les [[11-modules/02-http/ngx_http_api_module|informations d'état]] de chaque zone de mémoire partagée de ce type peuvent être [[11-modules/02-http/ngx_http_api_module|consultées]] ou [[11-modules/02-http/ngx_http_api_module|remises à zéro]] avec l'[[11-modules/02-http/ngx_http_api_module|API]] depuis la version 1.17.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

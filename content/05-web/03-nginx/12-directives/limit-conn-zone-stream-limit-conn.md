---
title: "limit_conn_zone (ngx_stream_limit_conn_module)"
description: "Directive nginx limit_conn_zone (ngx_stream_limit_conn_module) — Définit les paramètres d'une zone de mémoire partagée qui conserve l'état des différentes clés. L'état comprend notamment le nombre courant de connexions. La clé peut contenir du texte, des variables…"
tags: [nginx, directive, ngx_stream_limit_conn_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_conn_zone key zone=name:size;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_limit_conn_module\|ngx_stream_limit_conn_module]] |

## Utilisation

Définit les paramètres d'une zone de mémoire partagée qui conserve l'état des différentes clés. L'état comprend notamment le nombre courant de connexions. La *clé* peut contenir du texte, des variables et leurs combinaisons (1.11.2). Les connexions dont la clé est vide ne sont pas comptées. Exemple :

```nginx
limit_conn_zone $binary_remote_addr zone=addr:10m;
```

Ici, la clé est l'adresse IP du client, fournie par la variable `$binary_remote_addr`. Sa taille est de 4 octets pour les adresses IPv4 ou 16 octets pour les adresses IPv6. Un état stocké occupe toujours 32 ou 64 octets sur les plates-formes 32 bits et 64 octets sur les plates-formes 64 bits. Une zone d'un mégaoctet peut contenir environ 32 000 états de 32 octets ou environ 16 000 états de 64 octets. Si la zone est pleine, le serveur ferme la connexion.

> [!NOTE]
> En outre, dans le cadre de notre [abonnement commercial](https://nginx.com/products/), les [[11-modules/02-http/ngx_http_api_module|informations d'état]] de chaque zone de mémoire partagée de ce type peuvent être [[11-modules/02-http/ngx_http_api_module|consultées]] ou [[11-modules/02-http/ngx_http_api_module|remises à zéro]] avec l'[[11-modules/02-http/ngx_http_api_module|API]] depuis la version 1.17.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "proxy_set_header"
description: "Directive nginx proxy_set_header (ngx_http_proxy_module) — Permet de redéfinir ou d'ajouter des champs à l'en-tête de la requête transmis au serveur mandaté. La valeur (value) peut contenir du texte, des variables ou une combinaison des deux. Ces directives…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_set_header field value;` |
| **Valeur par défaut** | `proxy_set_header Host $proxy_host;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Permet de redéfinir ou d'ajouter des champs à l'en-tête de la requête [[12-directives/proxy-pass-request-headers|transmis]] au serveur mandaté. La valeur (*value*) peut contenir du texte, des variables ou une combinaison des deux. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `proxy_set_header` n'est définie au niveau courant.

Par défaut, les champs d'en-tête `Host` et `Connection` de la requête d'origine ne sont pas transmis au serveur mandaté. Si HTTP/1.0 ou HTTP/1.1 est [[12-directives/proxy-http-version|activé]] pour le relais, ces champs sont redéfinis :

```nginx
proxy_set_header Host       $proxy_host;
proxy_set_header Connection close;
```

En HTTP/2, le pseudo-champ d'en-tête `:authority` est envoyé par défaut avec la valeur *$proxy\_host*, sauf s'il est remplacé par un champ d'en-tête `Host` explicite.

Si le cache est activé, les champs d'en-tête `If-Modified-Since`, `If-Unmodified-Since`, `If-None-Match`, `If-Match`, `Range` et `If-Range` de la requête d'origine ne sont pas transmis au serveur mandaté.

Un champ d'en-tête de requête `Host` inchangé peut être transmis ainsi :

```nginx
proxy_set_header Host       $http_host;
```

Mais si ce champ est absent de l'en-tête de la requête du client, rien n'est transmis. Dans ce cas, il vaut mieux utiliser la variable `$host` : sa valeur est le nom de serveur du champ d'en-tête `Host`, ou le nom du serveur principal si ce champ est absent :

```nginx
proxy_set_header Host       $host;
```

On peut aussi transmettre le nom du serveur accompagné du port du serveur mandaté :

```nginx
proxy_set_header Host       $host:$proxy_port;
```

Si la valeur d'un champ d'en-tête est une chaîne vide, ce champ n'est pas transmis au serveur mandaté :

```nginx
proxy_set_header Accept-Encoding "";
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

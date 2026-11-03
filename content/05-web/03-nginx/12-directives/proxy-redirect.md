---
title: "proxy_redirect"
description: "Directive nginx proxy_redirect (ngx_http_proxy_module) — Définit le texte à modifier dans les champs d'en-tête Location et Refresh de la réponse d'un serveur mandaté. Supposons que le serveur mandaté renvoie le champ « Location:…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_redirect default;` ou `proxy_redirect off;` ou `proxy_redirect redirect replacement;` |
| **Valeur par défaut** | `proxy_redirect default;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit le texte à modifier dans les champs d'en-tête `Location` et `Refresh` de la réponse d'un serveur mandaté. Supposons que le serveur mandaté renvoie le champ « `Location: http://localhost:8000/two/some/uri/` ». La directive

```nginx
proxy_redirect http://localhost:8000/two/ http://frontend/one/;
```

réécrit cette chaîne en « `Location: http://frontend/one/some/uri/` ».

Le nom de serveur peut être omis dans la chaîne *replacement* :

```nginx
proxy_redirect http://localhost:8000/two/ /;
```

le nom du serveur principal et son port, s'il diffère de 80, sont alors insérés.

Le remplacement par défaut, défini par le paramètre `default`, utilise les paramètres des directives [[12-directives/location|location]] et [[12-directives/proxy-pass-http-proxy|proxy_pass]]. Les deux configurations ci-dessous sont donc équivalentes :

```nginx
location /one/ {
    proxy_pass     http://upstream:port/two/;
    proxy_redirect default;
```

```nginx
location /one/ {
    proxy_pass     http://upstream:port/two/;
    proxy_redirect http://upstream:port/two/ /one/;
```

Le paramètre `default` n'est pas autorisé si [[12-directives/proxy-pass-http-proxy|proxy_pass]] contient des variables.

La chaîne *replacement* peut contenir des variables :

```nginx
proxy_redirect http://localhost:8000/ http://$host:$server_port/;
```

*redirect* peut aussi contenir des variables (1.1.11) :

```nginx
proxy_redirect http://$proxy_host:8000/ /;
```

La directive peut utiliser des expressions régulières (1.1.11). Dans ce cas, *redirect* doit commencer par le symbole « `~` » pour une correspondance sensible à la casse, ou par « `~*` » pour une correspondance insensible à la casse. L'expression régulière peut contenir des captures nommées et positionnelles, auxquelles *replacement* peut faire référence :

```nginx
proxy_redirect ~^(http://[^:]+):\d+(/.+)$ $1$2;
proxy_redirect ~*/user/([^/]+)/(.+)$      http://$1.example.com/$2;
```

Plusieurs directives `proxy_redirect` peuvent être indiquées au même niveau :

```nginx
proxy_redirect default;
proxy_redirect http://localhost:8000/  /;
proxy_redirect http://www.example.com/ /;
```

Si plusieurs directives peuvent s'appliquer aux champs d'en-tête de la réponse du serveur mandaté, la première qui correspond est retenue.

Le paramètre `off` annule l'effet des directives `proxy_redirect` héritées du niveau de configuration précédent.

Cette directive permet aussi d'ajouter des noms d'hôtes aux redirections relatives émises par un serveur mandaté :

```nginx
proxy_redirect / /;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

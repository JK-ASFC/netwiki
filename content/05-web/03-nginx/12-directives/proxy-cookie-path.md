---
title: "proxy_cookie_path"
description: "Directive nginx proxy_cookie_path (ngx_http_proxy_module) — Définit le texte à modifier dans l'attribut path des champs d'en-tête Set-Cookie de la réponse d'un serveur mandaté. Supposons que le serveur mandaté renvoie le champ Set-Cookie avec l'attribut «…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cookie_path off;` ou `proxy_cookie_path path replacement;` |
| **Valeur par défaut** | `proxy_cookie_path off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.15 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit le texte à modifier dans l'attribut `path` des champs d'en-tête `Set-Cookie` de la réponse d'un serveur mandaté. Supposons que le serveur mandaté renvoie le champ `Set-Cookie` avec l'attribut « `path=/two/some/uri/` ». La directive

```nginx
proxy_cookie_path /two/ /;
```

réécrit cet attribut en « `path=/some/uri/` ».

Les chaînes *path* et *replacement* peuvent contenir des variables :

```nginx
proxy_cookie_path $uri /some$uri;
```

La directive peut aussi utiliser des expressions régulières. Dans ce cas, *path* doit commencer par le symbole « `~` » pour une correspondance sensible à la casse, ou par « `~*` » pour une correspondance insensible à la casse. L'expression régulière peut contenir des captures nommées et positionnelles, auxquelles *replacement* peut faire référence :

```nginx
proxy_cookie_path ~*^/user/([^/]+) /u/$1;
```

Plusieurs directives `proxy_cookie_path` peuvent être indiquées au même niveau :

```nginx
proxy_cookie_path /one/ /;
proxy_cookie_path / /two/;
```

Si plusieurs directives peuvent s'appliquer au cookie, la première qui correspond est retenue.

Le paramètre `off` annule l'effet des directives `proxy_cookie_path` héritées du niveau de configuration précédent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

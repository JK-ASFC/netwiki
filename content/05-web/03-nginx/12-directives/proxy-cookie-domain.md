---
title: "proxy_cookie_domain"
description: "Directive nginx proxy_cookie_domain (ngx_http_proxy_module) — Définit le texte à modifier dans l'attribut domain des champs d'en-tête Set-Cookie de la réponse d'un serveur mandaté. Supposons que le serveur mandaté renvoie le champ Set-Cookie avec l'attribut «…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cookie_domain off;` ou `proxy_cookie_domain domain replacement;` |
| **Valeur par défaut** | `proxy_cookie_domain off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.15 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit le texte à modifier dans l'attribut `domain` des champs d'en-tête `Set-Cookie` de la réponse d'un serveur mandaté. Supposons que le serveur mandaté renvoie le champ `Set-Cookie` avec l'attribut « `domain=localhost` ». La directive

```nginx
proxy_cookie_domain localhost example.org;
```

réécrit cet attribut en « `domain=example.org` ».

Un point au début des chaînes *domain* et *replacement* et de l'attribut `domain` est ignoré. La comparaison est insensible à la casse.

Les chaînes *domain* et *replacement* peuvent contenir des variables :

```nginx
proxy_cookie_domain www.$host $host;
```

La directive peut aussi utiliser des expressions régulières. Dans ce cas, *domain* doit commencer par le symbole « `~` ». L'expression régulière peut contenir des captures nommées et positionnelles, auxquelles *replacement* peut faire référence :

```nginx
proxy_cookie_domain ~\.(?P<sl_domain>[-0-9a-z]+\.[a-z]+)$ $sl_domain;
```

Plusieurs directives `proxy_cookie_domain` peuvent être indiquées au même niveau :

```nginx
proxy_cookie_domain localhost example.org;
proxy_cookie_domain ~\.([a-z]+\.[a-z]+)$ $1;
```

Si plusieurs directives peuvent s'appliquer au cookie, la première qui correspond est retenue.

Le paramètre `off` annule l'effet des directives `proxy_cookie_domain` héritées du niveau de configuration précédent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

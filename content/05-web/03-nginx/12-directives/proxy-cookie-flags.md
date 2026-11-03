---
title: "proxy_cookie_flags"
description: "Directive nginx proxy_cookie_flags (ngx_http_proxy_module) — Définit un ou plusieurs attributs (drapeaux) du cookie. cookie peut contenir du texte, des variables ou une combinaison des deux, de même que flag (1.19.8). Les paramètres secure, httponly,…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cookie_flags off \| cookie [flag ...];` |
| **Valeur par défaut** | `proxy_cookie_flags off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.19.3 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit un ou plusieurs attributs (drapeaux) du cookie. *cookie* peut contenir du texte, des variables ou une combinaison des deux, de même que *flag* (1.19.8). Les paramètres `secure`, `httponly`, `samesite=strict`, `samesite=lax` et `samesite=none` ajoutent les drapeaux correspondants ; `nosecure`, `nohttponly` et `nosamesite` les retirent.

Le cookie peut aussi être désigné par une expression régulière. Dans ce cas, *cookie* doit commencer par le symbole « `~` ».

Plusieurs directives `proxy_cookie_flags` peuvent être indiquées au même niveau de configuration :

```nginx
proxy_cookie_flags one httponly;
proxy_cookie_flags ~ nosecure samesite=strict;
```

Si plusieurs directives peuvent s'appliquer au cookie, la première qui correspond est retenue. Dans l'exemple, le drapeau `httponly` est ajouté au cookie `one` ; pour tous les autres cookies, le drapeau `samesite=strict` est ajouté et le drapeau `secure` est retiré.

Le paramètre `off` annule l'effet des directives `proxy_cookie_flags` héritées du niveau de configuration précédent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

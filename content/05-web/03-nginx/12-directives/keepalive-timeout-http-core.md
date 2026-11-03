---
title: "keepalive_timeout (ngx_http_core_module)"
description: "Directive nginx keepalive_timeout (ngx_http_core_module) — Le premier paramètre définit le délai pendant lequel une connexion persistante du client reste ouverte côté serveur. La valeur zéro désactive les connexions persistantes. Le second paramètre…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive_timeout timeout [header_timeout];` |
| **Valeur par défaut** | `keepalive_timeout 75s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Le premier paramètre définit le délai pendant lequel une connexion persistante du client reste ouverte côté serveur. La valeur zéro désactive les connexions persistantes. Le second paramètre facultatif définit la valeur du champ d'en-tête de réponse `Keep-Alive: timeout=time`. Les deux paramètres peuvent différer.

Le champ d'en-tête `Keep-Alive: timeout=time` est reconnu par Mozilla et Konqueror. MSIE ferme lui-même les connexions persistantes au bout d'environ 60 secondes.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "keepalive_min_timeout"
description: "Directive nginx keepalive_min_timeout (ngx_http_core_module) — Définit un délai pendant lequel une connexion persistante du client n'est pas fermée côté serveur, afin d'être réutilisée ou lors de l'arrêt en douceur des processus de travail."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive_min_timeout timeout;` |
| **Valeur par défaut** | `keepalive_min_timeout 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.27.4 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit un délai pendant lequel une connexion persistante du client n'est pas fermée côté serveur, afin d'être réutilisée ou lors de l'arrêt en douceur des processus de travail.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

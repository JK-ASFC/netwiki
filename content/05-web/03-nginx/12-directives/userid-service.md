---
title: "userid_service"
description: "Directive nginx userid_service (ngx_http_userid_module) — Si les identifiants sont émis par plusieurs serveurs (services), chacun doit recevoir son propre numéro (number) pour garantir l'unicité des identifiants. Pour les cookies de version 1, la valeur par…"
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid_service number;` |
| **Valeur par défaut** | `userid_service IP address of the server;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

Si les identifiants sont émis par plusieurs serveurs (services), chacun doit recevoir son propre numéro (*number*) pour garantir l'unicité des identifiants. Pour les cookies de version 1, la valeur par défaut est zéro ; pour la version 2, c'est le nombre formé par les quatre derniers octets de l'adresse IP du serveur.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

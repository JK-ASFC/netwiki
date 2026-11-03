---
title: "proxy_protocol (ngx_mail_proxy_module)"
description: "Directive nginx proxy_protocol (ngx_mail_proxy_module) — Active le protocole PROXY pour les connexions au serveur d'arrière-plan. Le paramètre on active la version 1 (format texte) et le paramètre v2 (1.31.4) la version 2 (format binaire)."
tags: [nginx, directive, ngx_mail_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_protocol on \| off \| v2;` |
| **Valeur par défaut** | `proxy_protocol off;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.19.8 |
| **Module** | [[11-modules/04-mail/ngx_mail_proxy_module\|ngx_mail_proxy_module]] |

## Utilisation

Active le [protocole PROXY](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) pour les connexions au serveur d'arrière-plan. Le paramètre `on` active la version 1 (format texte) et le paramètre `v2` (1.31.4) la version 2 (format binaire).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

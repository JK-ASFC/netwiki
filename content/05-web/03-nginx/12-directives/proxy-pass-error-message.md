---
title: "proxy_pass_error_message"
description: "Directive nginx proxy_pass_error_message (ngx_mail_proxy_module) — Indique s'il faut transmettre au client le message d'erreur obtenu lors de l'authentification auprès du serveur d'arrière-plan. En général, si l'authentification réussit dans nginx, le serveur…"
tags: [nginx, directive, ngx_mail_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass_error_message on \| off;` |
| **Valeur par défaut** | `proxy_pass_error_message off;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_proxy_module\|ngx_mail_proxy_module]] |

## Utilisation

Indique s'il faut transmettre au client le message d'erreur obtenu lors de l'authentification auprès du serveur d'arrière-plan.

En général, si l'authentification réussit dans nginx, le serveur d'arrière-plan ne peut pas renvoyer d'erreur. S'il en renvoie une, c'est qu'une erreur interne s'est produite, et son message peut contenir des informations à ne pas montrer au client. Toutefois, répondre par une erreur malgré un mot de passe correct est un comportement normal pour certains serveurs POP3 : par exemple, CommuniGatePro informe l'utilisateur d'un [dépassement de boîte aux lettres](http://www.stalker.com/CommuniGatePro/Alerts.html#Quota) ou d'autres événements en renvoyant périodiquement une [erreur d'authentification](http://www.stalker.com/CommuniGatePro/POP.html#Alerts). Il faut alors activer cette directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

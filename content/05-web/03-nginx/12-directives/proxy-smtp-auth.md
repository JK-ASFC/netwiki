---
title: "proxy_smtp_auth"
description: "Directive nginx proxy_smtp_auth (ngx_mail_proxy_module) — Active ou désactive l'authentification des utilisateurs auprès du serveur SMTP d'arrière-plan avec la commande AUTH. Si XCLIENT est aussi activé, la commande XCLIENT n'envoie pas le paramètre LOGIN."
tags: [nginx, directive, ngx_mail_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_smtp_auth on \| off;` |
| **Valeur par défaut** | `proxy_smtp_auth off;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.19.4 |
| **Module** | [[11-modules/04-mail/ngx_mail_proxy_module\|ngx_mail_proxy_module]] |

## Utilisation

Active ou désactive l'authentification des utilisateurs auprès du serveur SMTP d'arrière-plan avec la commande `AUTH`.

Si [[12-directives/xclient|XCLIENT]] est aussi activé, la commande `XCLIENT` n'envoie pas le paramètre `LOGIN`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

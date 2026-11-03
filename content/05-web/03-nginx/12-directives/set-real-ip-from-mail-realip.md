---
title: "set_real_ip_from (ngx_mail_realip_module)"
description: "Directive nginx set_real_ip_from (ngx_mail_realip_module) — Définit les adresses de confiance, connues pour transmettre des adresses de remplacement correctes. Avec la valeur spéciale unix:, tous les sockets de domaine UNIX sont considérés comme de confiance."
tags: [nginx, directive, ngx_mail_realip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `set_real_ip_from address \| CIDR \| unix:;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_realip_module\|ngx_mail_realip_module]] |

## Utilisation

Définit les adresses de confiance, connues pour transmettre des adresses de remplacement correctes. Avec la valeur spéciale `unix:`, tous les sockets de domaine UNIX sont considérés comme de confiance.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

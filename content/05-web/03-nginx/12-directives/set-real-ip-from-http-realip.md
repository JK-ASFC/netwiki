---
title: "set_real_ip_from (ngx_http_realip_module)"
description: "Directive nginx set_real_ip_from (ngx_http_realip_module) — Définit les adresses de confiance, connues pour transmettre des adresses de remplacement correctes. Avec la valeur spéciale unix:, tous les sockets de domaine UNIX sont considérés comme de confiance.…"
tags: [nginx, directive, ngx_http_realip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `set_real_ip_from address \| CIDR \| unix:;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_realip_module\|ngx_http_realip_module]] |

## Utilisation

Définit les adresses de confiance, connues pour transmettre des adresses de remplacement correctes. Avec la valeur spéciale `unix:`, tous les sockets de domaine UNIX sont considérés comme de confiance. Les adresses de confiance peuvent aussi être indiquées par un nom d'hôte (1.13.1).

> [!NOTE]
> Les adresses IPv6 sont prises en charge à partir des versions 1.3.0 et 1.2.1.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

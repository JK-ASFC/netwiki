---
title: "real_ip_recursive"
description: "Directive nginx real_ip_recursive (ngx_http_realip_module) — If recursive search is disabled, the original client address that matches one of the trusted addresses is replaced by the last address sent in the request header field defined by the real_ip_header…"
tags: [nginx, directive, ngx_http_realip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `real_ip_recursive on \| off;` |
| **Valeur par défaut** | `real_ip_recursive off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.3.0, 1.2.1 |
| **Module** | [[11-modules/02-http/ngx_http_realip_module\|ngx_http_realip_module]] |

## Utilisation

If recursive search is disabled, the original client address that matches one of the trusted addresses is replaced by the last address sent in the request header field defined by the [[12-directives/real-ip-header|real_ip_header]] directive. If recursive search is enabled, the original client address that matches one of the trusted addresses is replaced by the last non-trusted address sent in the request header field.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

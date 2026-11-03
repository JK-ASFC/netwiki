---
title: "license_token"
description: "Directive nginx license_token (ngx_mgmt_module) — Indique un fichier (file) de licence JWT. Par défaut, le fichier license.jwt est attendu dans /etc/nginx/ sous Linux ou /usr/local/etc/nginx/ sous FreeBSD."
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `license_token file;` |
| **Valeur par défaut** | `license_token license.jwt;` |
| **Contexte** | `mgmt` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Indique un fichier (*file*) de licence JWT. Par défaut, le fichier *license.jwt* est attendu dans `/etc/nginx/` sous Linux ou `/usr/local/etc/nginx/` sous FreeBSD.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

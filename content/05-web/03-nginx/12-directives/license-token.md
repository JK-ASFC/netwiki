---
title: "license_token"
description: "Directive nginx license_token (ngx_mgmt_module) — Specifies a JWT license file. By default, the license.jwt file is expected to be at /etc/nginx/ for Linux or at /usr/local/etc/nginx/ for FreeBSD."
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `license_token file;` |
| **Valeur par défaut** | `license_token license.jwt;` |
| **Contexte** | `mgmt` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Specifies a JWT license *file*. By default, the *license.jwt* file is expected to be at `/etc/nginx/` for Linux or at `/usr/local/etc/nginx/` for FreeBSD.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

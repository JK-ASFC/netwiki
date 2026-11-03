---
title: "state_path (ngx_mgmt_module)"
description: "Directive nginx state_path (ngx_mgmt_module) — Defines a directory for storing state files (nginx-mgmt-) created by the ngx_mgmt_module module. The default directory for Linux is /var/lib/nginx/state, for FreeBSD is /var/db/nginx/state."
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `state_path path;` |
| **Valeur par défaut** | — |
| **Contexte** | `mgmt` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Defines a directory for storing state files (`nginx-mgmt-*`) created by the `ngx_mgmt_module` module. The default directory for Linux is `/var/lib/nginx/state`, for FreeBSD is `/var/db/nginx/state`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

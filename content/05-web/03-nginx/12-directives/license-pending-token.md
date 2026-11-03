---
title: "license_pending_token"
description: "Directive nginx license_pending_token (ngx_mgmt_module) — Controls how a renewed JWT license token is handled after it is received from the F5 licensing endpoint. By default, the renewed token is saved and applied immediately. When set to a file path, the…"
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `license_pending_token file \| off;` |
| **Valeur par défaut** | — |
| **Contexte** | `mgmt` |
| **Apparue dans la version** | 1.31.3 |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Controls how a renewed JWT license token is handled after it is received from the F5 licensing endpoint. By default, the renewed token is saved and applied immediately.

When set to a *file* path, the renewed token is saved to the specified file but not applied. The path is relative to [[12-directives/state-path-mgmt|state_path]]. The token can be copied to the active license token file or applied using the `PUT` method of the `/api/10/license` API endpoint.

When set to `off`, the renewal event is logged but the token is discarded. In this case, JWT license renewal is managed entirely through the `PUT` method of the `/api/10/license` API endpoint.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

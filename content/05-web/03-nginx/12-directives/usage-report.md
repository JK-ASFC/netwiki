---
title: "usage_report"
description: "Directive nginx usage_report (ngx_mgmt_module) — Sets the address and port of the usage reporting endpoint. The interval parameter sets an interval between two consecutive reports. NOTE Before 1.27.2, the default values were nginx-mgmt.local and…"
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `usage_report [endpoint=address] [interval=time];` |
| **Valeur par défaut** | `usage_report endpoint=product.connect.nginx.com interval=1h;` |
| **Contexte** | `mgmt` |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Sets the *address* and *port* of the usage reporting endpoint. The `interval` parameter sets an interval between two consecutive reports.

> [!NOTE]
> Before 1.27.2, the default values were `nginx-mgmt.local` and `30m`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

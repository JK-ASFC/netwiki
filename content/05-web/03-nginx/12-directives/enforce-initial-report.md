---
title: "enforce_initial_report"
description: "Directive nginx enforce_initial_report (ngx_mgmt_module) — Enables or disables the 180-day grace period for sending the initial usage report. The initial usage report is sent immediately upon nginx first start after installation. By default, if the initial…"
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `enforce_initial_report on \| off;` |
| **Valeur par défaut** | `enforce_initial_report on;` |
| **Contexte** | `mgmt` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Enables or disables the 180-day grace period for sending the initial usage report.

The initial usage report is sent immediately upon nginx first start after installation. By default, if the initial report is not received by F5 licensing endpoint, nginx stops processing traffic until the report is successfully delivered. Setting the directive value to `off` enables the 180-day grace period during which the initial usage report must be received by F5 licensing endpoint.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

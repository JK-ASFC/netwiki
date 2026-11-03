---
title: "resolver (ngx_mgmt_module)"
description: "Directive nginx resolver (ngx_mgmt_module) — Configures name servers used to resolve usage reporting endpoint name. By default, the system resolver is used. See resolver for details."
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver address ... [valid=time] [ipv4=on\|off] [ipv6=on\|off] [status_zone=zone];` |
| **Valeur par défaut** | — |
| **Contexte** | `mgmt` |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Configures name servers used to resolve usage reporting endpoint name. By default, the system resolver is used.

See [[12-directives/resolver-http-core|resolver]] for details.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

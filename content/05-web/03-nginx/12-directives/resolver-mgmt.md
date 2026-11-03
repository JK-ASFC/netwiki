---
title: "resolver (ngx_mgmt_module)"
description: "Directive nginx resolver (ngx_mgmt_module) — Configure les serveurs de noms utilisés pour résoudre le nom du point de terminaison du rapport d'utilisation. Par défaut, le résolveur du système est utilisé. Voir resolver pour les détails."
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver address ... [valid=time] [ipv4=on\|off] [ipv6=on\|off] [status_zone=zone];` |
| **Valeur par défaut** | — |
| **Contexte** | `mgmt` |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Configure les serveurs de noms utilisés pour résoudre le nom du point de terminaison du rapport d'utilisation. Par défaut, le résolveur du système est utilisé.

Voir [[12-directives/resolver-http-core|resolver]] pour les détails.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "usage_report"
description: "Directive nginx usage_report (ngx_mgmt_module) — Définit l'adresse (address) et le port (port) du point de terminaison du rapport d'utilisation. Le paramètre interval définit l'intervalle entre deux rapports consécutifs. NOTE Avant la version…"
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `usage_report [endpoint=address] [interval=time];` |
| **Valeur par défaut** | `usage_report endpoint=product.connect.nginx.com interval=1h;` |
| **Contexte** | `mgmt` |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Définit l'adresse (*address*) et le port (*port*) du point de terminaison du rapport d'utilisation. Le paramètre `interval` définit l'intervalle entre deux rapports consécutifs.

> [!NOTE]
> Avant la version 1.27.2, les valeurs par défaut étaient `nginx-mgmt.local` et `30m`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

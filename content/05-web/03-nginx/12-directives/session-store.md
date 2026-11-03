---
title: "session_store"
description: "Directive nginx session_store (ngx_http_oidc_module) — Indique une base clé-valeur personnalisée qui stocke les données de session. Par défaut, une base clé-valeur de 8 mégaoctets nommée oidc_default_store_<provider name est créée automatiquement. NOTE…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_store name;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Indique une [[12-directives/keyval-zone-http-keyval|base clé-valeur]] personnalisée qui stocke les données de session. Par défaut, une base clé-valeur de 8 mégaoctets nommée `oidc_default_store_<provider name>` est créée automatiquement.

> [!NOTE]
> Il faut configurer une base clé-valeur distincte pour chaque fournisseur afin d'empêcher la réutilisation des sessions d'un fournisseur à l'autre.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

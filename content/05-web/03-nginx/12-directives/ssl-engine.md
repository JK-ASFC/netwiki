---
title: "ssl_engine"
description: "Directive nginx ssl_engine (ngx_core_module) — Définit le nom de l'accélérateur SSL matériel. NOTE Le module peut être chargé dynamiquement par OpenSSL lors du test de la configuration."
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_engine device;` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Définit le nom de l'accélérateur SSL matériel.

> [!NOTE]
> Le module peut être chargé dynamiquement par OpenSSL lors du test de la configuration.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

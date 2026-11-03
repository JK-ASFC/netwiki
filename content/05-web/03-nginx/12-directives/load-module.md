---
title: "load_module"
description: "Directive nginx load_module (ngx_core_module) — Charge un module dynamique. Exemple : nginx load_module modules/ngx_mail_module.so;"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `load_module file;` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Apparue dans la version** | 1.9.11 |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Charge un module dynamique.

Exemple :

```nginx
load_module modules/ngx_mail_module.so;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

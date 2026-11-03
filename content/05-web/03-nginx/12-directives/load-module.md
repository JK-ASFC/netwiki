---
title: "load_module"
description: "Directive nginx load_module (Core functionality) — Loads a dynamic module. Example: nginx load_module modules/ngx_mail_module.so;"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `load_module file;` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Apparue dans la version** | 1.9.11 |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

Loads a dynamic module.

Example:

```nginx
load_module modules/ngx_mail_module.so;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

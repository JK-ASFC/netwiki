---
title: "include"
description: "Directive nginx include (Core functionality) — Includes another file, or files matching the specified mask, into configuration. Included files should consist of syntactically correct directives and blocks. Usage example: nginx include mime.types;…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `include file \| mask;` |
| **Valeur par défaut** | — |
| **Contexte** | `` |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

Includes another *file*, or files matching the specified *mask*, into configuration. Included files should consist of syntactically correct directives and blocks.

Usage example:

```nginx
include mime.types;
include vhosts/*.conf;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "include"
description: "Directive nginx include (ngx_core_module) — Inclut dans la configuration un autre fichier (file), ou les fichiers correspondant au masque (mask) indiqué. Les fichiers inclus doivent contenir des directives et des blocs syntaxiquement corrects.…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `include file \| mask;` |
| **Valeur par défaut** | — |
| **Contexte** | `` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Inclut dans la configuration un autre fichier (*file*), ou les fichiers correspondant au masque (*mask*) indiqué. Les fichiers inclus doivent contenir des directives et des blocs syntaxiquement corrects.

Exemple d'utilisation :

```nginx
include mime.types;
include vhosts/*.conf;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

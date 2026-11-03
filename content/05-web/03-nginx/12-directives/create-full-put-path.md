---
title: "create_full_put_path"
description: "Directive nginx create_full_put_path (ngx_http_dav_module) — La spécification WebDAV ne permet de créer des fichiers que dans des répertoires existants. Cette directive permet de créer tous les répertoires intermédiaires nécessaires."
tags: [nginx, directive, ngx_http_dav_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `create_full_put_path on \| off;` |
| **Valeur par défaut** | `create_full_put_path off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_dav_module\|ngx_http_dav_module]] |

## Utilisation

La spécification WebDAV ne permet de créer des fichiers que dans des répertoires existants. Cette directive permet de créer tous les répertoires intermédiaires nécessaires.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

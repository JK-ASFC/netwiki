---
title: "lock_file"
description: "Directive nginx lock_file (ngx_core_module) — nginx utilise un mécanisme de verrouillage pour mettre en œuvre accept_mutex et sérialiser l'accès à la mémoire partagée. Sur la plupart des systèmes, les verrous reposent sur des opérations…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `lock_file file;` |
| **Valeur par défaut** | `lock_file logs/nginx.lock;` |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

nginx utilise un mécanisme de verrouillage pour mettre en œuvre [[12-directives/accept-mutex|accept_mutex]] et sérialiser l'accès à la mémoire partagée. Sur la plupart des systèmes, les verrous reposent sur des opérations atomiques et cette directive est ignorée. Sur les autres, le mécanisme du « fichier de verrou » est utilisé. Cette directive indique un préfixe pour le nom des fichiers de verrou.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

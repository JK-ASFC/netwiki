---
title: "state_path (ngx_mgmt_module)"
description: "Directive nginx state_path (ngx_mgmt_module) — Définit le répertoire des fichiers d'état (nginx-mgmt-) créés par le module ngx_mgmt_module. Le répertoire par défaut est /var/lib/nginx/state sous Linux et /var/db/nginx/state sous FreeBSD."
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `state_path path;` |
| **Valeur par défaut** | — |
| **Contexte** | `mgmt` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Définit le répertoire des fichiers d'état (`nginx-mgmt-*`) créés par le module `ngx_mgmt_module`. Le répertoire par défaut est `/var/lib/nginx/state` sous Linux et `/var/db/nginx/state` sous FreeBSD.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

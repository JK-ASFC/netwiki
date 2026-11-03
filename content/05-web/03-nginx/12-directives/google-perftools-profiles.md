---
title: "google_perftools_profiles"
description: "Directive nginx google_perftools_profiles (ngx_google_perftools_module) — Définit le nom du fichier qui contient les informations de profilage d'un processus de travail de nginx. L'identifiant du processus de travail fait toujours partie du nom de fichier et est ajouté à…"
tags: [nginx, directive, ngx_google_perftools_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `google_perftools_profiles file;` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Module** | [[11-modules/05-autres/ngx_google_perftools_module\|ngx_google_perftools_module]] |

## Utilisation

Définit le nom du fichier qui contient les informations de profilage d'un processus de travail de nginx. L'identifiant du processus de travail fait toujours partie du nom de fichier et est ajouté à la fin, après un point.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

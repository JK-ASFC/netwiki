---
title: "license_pending_token"
description: "Directive nginx license_pending_token (ngx_mgmt_module) — Contrôle le traitement d'un jeton de licence JWT renouvelé reçu du point de terminaison de licences de F5. Par défaut, il est enregistré et appliqué immédiatement. Avec un chemin de fichier (file),…"
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `license_pending_token file \| off;` |
| **Valeur par défaut** | — |
| **Contexte** | `mgmt` |
| **Apparue dans la version** | 1.31.3 |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Contrôle le traitement d'un jeton de licence JWT renouvelé reçu du point de terminaison de licences de F5. Par défaut, il est enregistré et appliqué immédiatement.

Avec un chemin de fichier (*file*), le jeton renouvelé est enregistré dans ce fichier sans être appliqué. Le chemin est relatif à [[12-directives/state-path-mgmt|state_path]]. Le jeton peut ensuite être copié dans le fichier de licence actif ou appliqué avec la méthode `PUT` du point de terminaison d'API `/api/10/license`.

Avec `off`, l'événement de renouvellement est journalisé mais le jeton est abandonné. Le renouvellement de la licence JWT se gère alors entièrement avec la méthode `PUT` du point de terminaison d'API `/api/10/license`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

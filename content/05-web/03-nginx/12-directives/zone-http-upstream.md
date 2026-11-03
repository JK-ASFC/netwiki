---
title: "zone (ngx_http_upstream_module)"
description: "Directive nginx zone (ngx_http_upstream_module) — Définit le nom (name) et la taille (size) de la zone de mémoire partagée qui conserve la configuration du groupe et son état d'exécution, partagés entre les processus de travail. Plusieurs groupes…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone name [size];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.9.0 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Définit le nom (*name*) et la taille (*size*) de la zone de mémoire partagée qui conserve la configuration du groupe et son état d'exécution, partagés entre les processus de travail. Plusieurs groupes peuvent partager la même zone ; il suffit alors d'indiquer la taille une seule fois.

En outre, dans le cadre de notre [abonnement commercial](https://nginx.com/products/), ces groupes permettent de modifier la composition du groupe ou les réglages d'un serveur sans redémarrer nginx. La configuration est accessible par le module [[11-modules/02-http/ngx_http_api_module|API]] (1.13.3).

> [!NOTE]
> Avant la version 1.13.3, la configuration n'était accessible que par un bloc location spécial traité par [[12-directives/upstream-conf|upstream_conf]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

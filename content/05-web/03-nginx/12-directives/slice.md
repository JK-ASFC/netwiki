---
title: "slice"
description: "Directive nginx slice (ngx_http_slice_module) — Définit la taille (size) des tranches. La valeur zéro désactive le découpage des réponses. Une valeur trop faible peut entraîner une consommation de mémoire excessive et l'ouverture d'un grand nombre…"
tags: [nginx, directive, ngx_http_slice_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `slice size;` |
| **Valeur par défaut** | `slice 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_slice_module\|ngx_http_slice_module]] |

## Utilisation

Définit la taille (*size*) des tranches. La valeur zéro désactive le découpage des réponses. Une valeur trop faible peut entraîner une consommation de mémoire excessive et l'ouverture d'un grand nombre de fichiers.

Pour qu'une sous-requête renvoie la plage voulue, la variable `$slice_range` doit être [[12-directives/proxy-set-header|transmise]] au serveur mandaté dans le champ d'en-tête de requête `Range`. Si le [[12-directives/proxy-cache|cache]] est activé, `$slice_range` doit être ajoutée à la [[12-directives/proxy-cache-key|clé de cache]] et la mise en cache des réponses de statut 206 doit être [[12-directives/proxy-cache-valid|activée]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

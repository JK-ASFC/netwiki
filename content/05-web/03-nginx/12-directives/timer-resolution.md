---
title: "timer_resolution"
description: "Directive nginx timer_resolution (ngx_core_module) — Réduit la résolution du minuteur dans les processus de travail, et donc le nombre d'appels système gettimeofday. Par défaut, gettimeofday est appelé à chaque événement reçu du noyau. Avec une…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `timer_resolution interval;` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Réduit la résolution du minuteur dans les processus de travail, et donc le nombre d'appels système `gettimeofday`. Par défaut, `gettimeofday` est appelé à chaque événement reçu du noyau. Avec une résolution réduite, il n'est appelé qu'une fois par intervalle (*interval*) indiqué.

Exemple :

```nginx
timer_resolution 100ms;
```

La mise en œuvre interne de l'intervalle dépend de la méthode utilisée :

- le filtre `EVFILT_TIMER` si `kqueue` est utilisé ;
- `timer_create` si `eventport` est utilisé ;
- `setitimer` dans les autres cas.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

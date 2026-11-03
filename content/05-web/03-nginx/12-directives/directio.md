---
title: "directio"
description: "Directive nginx directio (ngx_http_core_module) — Active l'utilisation de l'option O_DIRECT (FreeBSD, Linux), de l'option F_NOCACHE (macOS) ou de la fonction directio (Solaris) pour lire les fichiers dont la taille est supérieure ou égale à la…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `directio size \| off;` |
| **Valeur par défaut** | `directio off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.7 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active l'utilisation de l'option `O_DIRECT` (FreeBSD, Linux), de l'option `F_NOCACHE` (macOS) ou de la fonction `directio` (Solaris) pour lire les fichiers dont la taille est supérieure ou égale à la taille (*size*) indiquée. La directive désactive automatiquement (0.7.15) l'utilisation de [[12-directives/sendfile|sendfile]] pour la requête concernée. Elle peut être utile pour servir de gros fichiers :

```nginx
directio 4m;
```

ou avec [[12-directives/aio|aio]] sous Linux.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

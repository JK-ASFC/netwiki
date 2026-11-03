---
title: "ngx_google_perftools_module"
description: "Module nginx ngx_google_perftools_module — Le module ngx_google_perftools_module (0.6.29) permet de profiler les processus de travail de nginx avec Google Performance Tools. Il est destiné aux développeurs de nginx."
tags: [nginx, module, ngx_google_perftools_module]
icon: puzzle
---

Le module `ngx_google_perftools_module` (0.6.29) permet de profiler les processus de travail de nginx avec [Google Performance Tools](https://github.com/gperftools/gperftools). Il est destiné aux développeurs de nginx.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-google_perftools_module`.

> [!NOTE]
> Ce module nécessite la bibliothèque [gperftools](https://github.com/gperftools/gperftools).

## Exemple de configuration

```nginx
google_perftools_profiles /path/to/profile;
```

Les profils sont enregistrés sous `/path/to/profile.<worker_pid>`.

## Directives

- [[12-directives/google-perftools-profiles|google_perftools_profiles]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

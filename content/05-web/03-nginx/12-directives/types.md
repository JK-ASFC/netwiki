---
title: "types"
description: "Directive nginx types (ngx_http_core_module) — Associe des extensions de noms de fichiers aux types MIME des réponses. Les extensions sont insensibles à la casse. Plusieurs extensions peuvent être associées à un même type, par exemple : nginx…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `types { ... }` |
| **Valeur par défaut** | `types text/html html; image/gif gif; image/jpeg jpg;;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Associe des extensions de noms de fichiers aux types MIME des réponses. Les extensions sont insensibles à la casse. Plusieurs extensions peuvent être associées à un même type, par exemple :

```nginx
types {
    application/octet-stream bin exe dll;
    application/octet-stream deb;
    application/octet-stream dmg;
}
```

Une table de correspondance assez complète est fournie avec nginx dans le fichier `conf/mime.types`.

Pour qu'un bloc location renvoie le type MIME « `application/octet-stream` » pour toutes les requêtes, on peut utiliser la configuration suivante :

```nginx
location /download/ {
    types        { }
    default_type application/octet-stream;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

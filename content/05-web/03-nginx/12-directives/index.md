---
title: "index"
description: "Directive nginx index (ngx_http_index_module) — Définit les fichiers utilisés comme index. Le nom de fichier (file) peut contenir des variables. Les fichiers sont vérifiés dans l'ordre indiqué. Le dernier élément de la liste peut être un fichier…"
tags: [nginx, directive, ngx_http_index_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `index file ...;` |
| **Valeur par défaut** | `index index.html;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_index_module\|ngx_http_index_module]] |

## Utilisation

Définit les fichiers utilisés comme index. Le nom de fichier (*file*) peut contenir des variables. Les fichiers sont vérifiés dans l'ordre indiqué. Le dernier élément de la liste peut être un fichier avec un chemin absolu. Exemple :

```nginx
index index.$geo.html index.0.html /index.html;
```

À noter : l'utilisation d'un fichier d'index provoque une redirection interne, et la requête peut alors être traitée dans un autre bloc location. Par exemple, avec la configuration suivante :

```nginx
location = / {
    index index.html;
}

location / {
    ...
}
```

une requête « `/` » sera en réalité traitée dans le second bloc location sous la forme « `/index.html` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

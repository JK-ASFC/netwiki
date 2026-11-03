---
title: "root"
description: "Directive nginx root (ngx_http_core_module) — Définit le répertoire racine des requêtes. Par exemple, avec la configuration suivante nginx location /i/ { root /data/w3; } le fichier /data/w3/i/top.gif est envoyé en réponse à la requête «…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `root path;` |
| **Valeur par défaut** | `root html;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le répertoire racine des requêtes. Par exemple, avec la configuration suivante

```nginx
location /i/ {
    root /data/w3;
}
```

le fichier `/data/w3/i/top.gif` est envoyé en réponse à la requête « `/i/top.gif` ».

La valeur *path* peut contenir des variables, sauf `$document_root` et `$realpath_root`.

Le chemin du fichier est construit en ajoutant simplement l'URI à la valeur de la directive `root`. Si l'URI doit être modifié, utiliser la directive [[12-directives/alias|alias]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

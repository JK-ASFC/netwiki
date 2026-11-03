---
title: "ssl_object_cache_inheritable"
description: "Directive nginx ssl_object_cache_inheritable (ngx_core_module) — Si cette option est activée, les objets SSL (certificats, clés secrètes, certificats d'autorités de confiance, listes de révocation) sont conservés d'un rechargement de configuration à l'autre. Les…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_object_cache_inheritable on \| off;` |
| **Valeur par défaut** | `ssl_object_cache_inheritable on;` |
| **Contexte** | `main` |
| **Apparue dans la version** | 1.27.4 |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Si cette option est activée, les objets SSL (certificats, clés secrètes, certificats d'autorités de confiance, listes de révocation) sont conservés d'un rechargement de configuration à l'autre.

Les objets SSL chargés depuis un fichier sont conservés si la date de modification et l'index du fichier n'ont pas changé depuis le chargement précédent. Les clés secrètes indiquées sous la forme `engine:name:id` ne sont jamais conservées. Celles indiquées sous la forme `data:value` le sont toujours.

> [!NOTE]
> Les objets SSL chargés depuis des variables ne peuvent pas être conservés.

Exemple :

```nginx
ssl_object_cache_inheritable on;

http {
    ...
    server {
        ...
        ssl_certificate     example.com.crt;
        ssl_certificate_key example.com.key;
    }
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

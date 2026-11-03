---
title: "merge_slashes"
description: "Directive nginx merge_slashes (ngx_http_core_module) — Active ou désactive la fusion de plusieurs barres obliques consécutives d'un URI en une seule. Cette fusion est indispensable pour que les blocs location à chaîne de préfixe et à expression régulière…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `merge_slashes on \| off;` |
| **Valeur par défaut** | `merge_slashes on;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive la fusion de plusieurs barres obliques consécutives d'un URI en une seule.

Cette fusion est indispensable pour que les blocs location à chaîne de préfixe et à expression régulière correspondent correctement. Sans elle, la requête « `//scripts/one.php` » ne correspondrait pas à

```nginx
location /scripts/ {
    ...
}
```

et pourrait être traitée comme un fichier statique. Elle est donc convertie en « `/scripts/one.php` ».

Désactiver la fusion (`off`) peut devenir nécessaire si un URI contient des noms encodés en base64, car base64 utilise le caractère « `/` ». Pour des raisons de sécurité, il vaut toutefois mieux éviter de la désactiver.

Si la directive est indiquée au niveau [[12-directives/server-http-core|server]], la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la section « [[10-guides/02-http/server-names|Choix du serveur virtuel]] ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

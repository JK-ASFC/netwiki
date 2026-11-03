---
title: "json_set"
description: "Directive nginx json_set (ngx_http_json_module) — Affecte à la variable (variable) la valeur extraite, au chemin (path) donné, du document JSON contenu dans la variable source (source). Dans un chemin, les membres d'objet sont séparés par un point…"
tags: [nginx, directive, ngx_http_json_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `json_set $variable $source path;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_json_module\|ngx_http_json_module]] |

## Utilisation

Affecte à la variable (*variable*) la valeur extraite, au chemin (*path*) donné, du document JSON contenu dans la variable source (*source*).

Dans un chemin, les membres d'objet sont séparés par un point et les éléments de tableau désignés par un indice commençant à zéro entre crochets :

```nginx
client_body_early_read on;

json_set $req_id     $request_body request.id;
json_set $enabled    $request_body settings.enabled;
json_set $first_item $request_body items[0];
```

Un nom de membre vide ou contenant « `.` », « `[` » ou « `]` » s'écrit comme une chaîne JSON entre crochets. Comme un tel chemin contient des guillemets doubles, tout l'argument doit être placé entre guillemets dans le fichier de configuration :

```nginx
json_set $domain $request_body '["a.b.com"]';
json_set $nested $request_body 'obj["a.b"].c[2]';
```

La valeur d'une chaîne JSON est stockée sans échappement. Les nombres, booléens et `null` sont stockés tels qu'ils apparaissent dans le document. Si le chemin désigne un objet ou un tableau, tout son texte est stocké, accolades ou crochets compris.

Si le membre ou l'élément désigné est absent, la variable est introuvable. Si la variable source (*source*) est vide ou introuvable, ou si sa valeur n'est pas un document JSON valide et complet, toutes les variables extraites de cette source sont introuvables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

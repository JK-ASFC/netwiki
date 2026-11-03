---
title: "valid_referers"
description: "Directive nginx valid_referers (ngx_http_referer_module) — Indique les valeurs du champ d'en-tête de requête Referer pour lesquelles la variable intégrée $invalid_referer vaut une chaîne vide ; sinon, elle vaut « 1 ». La comparaison est insensible à la…"
tags: [nginx, directive, ngx_http_referer_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `valid_referers none \| blocked \| server_names \| string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_referer_module\|ngx_http_referer_module]] |

## Utilisation

Indique les valeurs du champ d'en-tête de requête `Referer` pour lesquelles la variable intégrée `$invalid_referer` vaut une chaîne vide ; sinon, elle vaut « `1` ». La comparaison est insensible à la casse.

Les paramètres peuvent être :

- **`none`**

  le champ `Referer` est absent de l'en-tête de la requête ;

- **`blocked`**

  le champ `Referer` est présent, mais sa valeur a été supprimée par un pare-feu ou un serveur mandataire ; ces valeurs sont des chaînes qui ne commencent ni par « `http://` » ni par « `https://` » ;

- **`server_names`**

  le champ d'en-tête de requête `Referer` contient l'un des noms du serveur ;

- **chaîne quelconque**

  définit un nom de serveur et un préfixe d'URI facultatif. Un nom de serveur peut commencer ou se terminer par « `*` ». Lors de la vérification, le port du serveur dans le champ `Referer` est ignoré ;

- **expression régulière**

  le premier caractère doit être « `~` ». L'expression est comparée au texte qui suit « `http://` » ou « `https://` ».

Exemple :

```nginx
valid_referers none blocked server_names
               *.example.com example.* www.example.org/galleries/
               ~\.google\.;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

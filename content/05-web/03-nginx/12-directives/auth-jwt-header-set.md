---
title: "auth_jwt_header_set"
description: "Directive nginx auth_jwt_header_set (ngx_http_auth_jwt_module) — Affecte à la variable (variable) un paramètre d'en-tête JOSE identifié par des noms de clés. La correspondance des noms part du niveau supérieur de l'arbre JSON. Pour les tableaux, la variable…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_header_set $variable name ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Apparue dans la version** | 1.11.10 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Affecte à la variable (*variable*) un paramètre d'en-tête JOSE identifié par des noms de clés. La correspondance des noms part du niveau supérieur de l'arbre JSON. Pour les tableaux, la variable contient la liste des éléments séparés par des virgules.

> [!NOTE]
> Avant la version 1.13.7, un seul nom de clé pouvait être indiqué, et le résultat était indéfini pour les tableaux.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

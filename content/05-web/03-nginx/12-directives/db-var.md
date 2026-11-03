---
title: "db_var"
description: "Directive nginx db_var (ngx_http_db_module) — Crée une variable dont la valeur provient du corps de réponse d'une sous-requête. Le paramètre location définit l'URI de la sous-requête et le paramètre query sa chaîne de requête. Une chaîne de…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_var $variable location=URI query=string [default=string];` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Crée une variable dont la valeur provient du corps de réponse d'une sous-requête. Le paramètre `location` définit l'URI de la sous-requête et le paramètre `query` sa chaîne de requête. Une chaîne de requête vide peut être indiquée explicitement :

```nginx
db_var $configuration /_configuration "";
```

Les valeurs des paramètres peuvent contenir du texte, des variables ou une combinaison des deux.

Si la sous-requête renvoie `200 OK`, son corps de réponse est affecté à la variable. Un corps vide est une valeur valide.

Si la sous-requête renvoie `404 Not Found`, la valeur indiquée par le paramètre `default` est affectée à la variable ; elle peut contenir des variables. Sans paramètre `default`, la variable est marquée comme introuvable.

Les variables sont alimentées pendant la phase de pré-accès, pas lors de leur première évaluation. Elles doivent être utilisées dans les phases suivantes, comme l'accès ou la production du contenu. Les lire plus tôt, par exemple dans [[12-directives/if|if]], [[12-directives/set-http-rewrite|set]] ou [[12-directives/return-http-rewrite|return]] pendant la phase de réécriture, ne déclenche pas de recherche.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

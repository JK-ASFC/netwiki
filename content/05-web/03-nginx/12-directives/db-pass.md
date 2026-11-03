---
title: "db_pass"
description: "Directive nginx db_pass (ngx_http_db_module) — Indique le groupe amont utilisé pour les recherches dans la base : nginx db_pass redis_backend; Le groupe doit être configuré avec db_type. Une adresse de serveur ne peut pas être indiquée…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_pass name;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Indique le groupe amont utilisé pour les recherches dans la base :

```nginx
db_pass redis_backend;
```

Le groupe doit être configuré avec [[12-directives/db-type|db_type]]. Une adresse de serveur ne peut pas être indiquée directement.

La directive [[12-directives/db-get|db_get]] doit aussi être configurée, dans la configuration courante ou héritée d'un bloc location parent.

Seules les requêtes `GET` et `HEAD` sont acceptées ; les autres méthodes renvoient `405 Method Not Allowed`. Le corps de la requête du client est ignoré. Les en-têtes et le corps de la requête du client ne sont pas transmis à la base.

Le type de contenu de la réponse est déterminé par les directives [[12-directives/types|types]] et [[12-directives/default-type|default_type]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

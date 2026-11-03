---
title: "js_set (ngx_http_js_module)"
description: "Directive nginx js_set (ngx_http_js_module) — Définit une fonction njs (function) pour la variable (variable) indiquée. Depuis la version 0.4.0, on peut faire référence à une fonction de module. La fonction est appelée lors du premier accès à la…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_set $variable module.function [nocache];` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Définit une fonction njs (`function`) pour la variable (`variable`) indiquée. Depuis la version 0.4.0, on peut faire référence à une fonction de module.

La fonction est appelée lors du premier accès à la variable pour une requête donnée. Le moment exact dépend de la [[10-guides/06-developpement/development-guide|phase]] à laquelle la variable est utilisée. On peut s'en servir pour exécuter une logique sans rapport avec l'évaluation de la variable. Par exemple, si la variable n'est utilisée que dans la directive [[12-directives/log-format-http-log|log_format]], son gestionnaire n'est exécuté qu'à la phase de journalisation ; il peut alors servir à faire du nettoyage juste avant la libération de la requête.

Depuis la version 0.8.6, avec l'argument facultatif `nocache`, le gestionnaire est appelé à chaque accès. En raison des limites actuelles du module [[11-modules/02-http/ngx_http_rewrite_module|rewrite]], lorsqu'une variable `nocache` est utilisée par la directive [[12-directives/set-http-rewrite|set]], son gestionnaire doit toujours renvoyer une valeur de longueur fixe.

> [!NOTE]
> Comme le gestionnaire `js_set` renvoie son résultat immédiatement, il ne prend en charge que les opérations synchrones. Les opérations asynchrones comme [[10-guides/04-njs/reference|r.subrequest()]] ou [[10-guides/04-njs/reference|setTimeout()]] ne sont donc pas prises en charge.

> [!NOTE]
> La directive peut être indiquée aux niveaux `server` et `location` depuis la version 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

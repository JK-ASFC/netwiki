---
title: "error_log_tag"
description: "Directive nginx error_log_tag (ngx_http_core_module) — Définit une étiquette de contexte supplémentaire pour les messages du journal d'erreurs HTTP au format texte ou JSON, en plus des étiquettes par défaut. value peut contenir du texte, des variables ou…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `error_log_tag name value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.8 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit une étiquette de contexte supplémentaire pour les messages du [[12-directives/error-log|journal d'erreurs]] HTTP au format texte ou [[11-modules/01-coeur/ngx_core_module|JSON]], en plus des étiquettes par défaut. `value` peut contenir du texte, des variables ou une combinaison des deux :

```nginx
error_log_tag  request_id  $request_id;
```

Plusieurs directives `error_log_tag` peuvent être indiquées au même niveau. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `error_log_tag` n'est définie au niveau courant.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "auth_require"
description: "Directive nginx auth_require (ngx_http_auth_require_module) — Active l'autorisation selon les variables indiquées. L'accès n'est autorisé que si aucune variable n'est vide ni égale à « 0 ». Sinon, le module renvoie le code 403, modifiable avec le paramètre…"
tags: [nginx, directive, ngx_http_auth_require_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_require $value ... [error=4xx \| 5xx];` |
| **Valeur par défaut** | `auth_require off;` |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_auth_require_module\|ngx_http_auth_require_module]] |

## Utilisation

Active l'autorisation selon les variables indiquées. L'accès n'est autorisé que si aucune variable n'est vide ni égale à « 0 ». Sinon, le module renvoie le code `403`, modifiable avec le paramètre `error`. Plusieurs directives `auth_require` peuvent servir à renvoyer des codes d'erreur différents.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

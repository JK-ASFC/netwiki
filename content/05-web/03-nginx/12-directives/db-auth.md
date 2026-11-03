---
title: "db_auth"
description: "Directive nginx db_auth (ngx_http_db_module) — Indique le mot de passe utilisé pour authentifier les connexions au serveur de base de données. Une valeur vide désactive l'authentification. L'authentification avec un nom d'utilisateur et un mot de…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_auth string;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Indique le mot de passe utilisé pour authentifier les connexions au serveur de base de données. Une valeur vide désactive l'authentification. L'authentification avec un nom d'utilisateur et un mot de passe distincts n'est pas prise en charge.

```nginx
location /db/ {
    db_pass redis_backend;
    db_auth secret;
    db_get  $arg_key;
}
```

Avec Redis, le mot de passe est transmis comme argument unique de la commande `AUTH`.

La directive est héritée du niveau de configuration précédent si et seulement si aucune directive `db_auth` n'est définie au niveau courant.

Pour protéger le mot de passe, activez les connexions SSL/TLS vers le serveur de base de données avec la directive [[12-directives/db-ssl|db_ssl]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

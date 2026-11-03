---
title: "ngx_http_session_log_module"
description: "Module nginx ngx_http_session_log_module — Le module ngx_http_session_log_module permet de journaliser des sessions (agrégats de plusieurs requêtes HTTP) au lieu de requêtes HTTP individuelles."
tags: [nginx, module, ngx_http_session_log_module]
icon: puzzle
---

Le module `ngx_http_session_log_module` permet de journaliser des sessions (agrégats de plusieurs requêtes HTTP) au lieu de requêtes HTTP individuelles.

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

La configuration suivante met en place un journal de sessions et associe les requêtes aux sessions selon l'adresse du client et le champ d'en-tête de requête `User-Agent` :

```nginx
session_log_zone /path/to/log format=combined
                 zone=one:1m timeout=30s
                 md5=$binary_remote_addr$http_user_agent;

location /media/ {
    session_log one;
}
```

## Directives

- [[12-directives/session-log|session_log]]
- [[12-directives/session-log-format|session_log_format]]
- [[12-directives/session-log-zone|session_log_zone]]

## Variables intégrées

- [[13-variables/session-log-id|$session_log_id]]
- [[13-variables/session-log-binary-id|$session_log_binary_id]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ngx_http_log_module"
description: "Module nginx ngx_http_log_module — Le module ngx_http_log_module écrit les journaux des requêtes au format indiqué."
tags: [nginx, module, ngx_http_log_module]
icon: puzzle
---

Le module `ngx_http_log_module` écrit les journaux des requêtes au format indiqué.

Les requêtes sont journalisées dans le contexte du bloc location où leur traitement se termine. Il peut différer du bloc location d'origine si une [[12-directives/internal|redirection interne]] a lieu pendant le traitement.

## Exemple de configuration

```nginx
log_format compression '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $bytes_sent '
                       '"$http_referer" "$http_user_agent" "$gzip_ratio"';

access_log /spool/logs/nginx-access.log compression buffer=32k;
```

## Directives

- [[12-directives/access-log-http-log|access_log]]
- [[12-directives/log-format-http-log|log_format]]
- [[12-directives/open-log-file-cache-http-log|open_log_file_cache]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ngx_core_module"
description: "Module nginx ngx_core_module — error_log /var/log/nginx-error.log info;"
tags: [nginx, module, ngx_core_module]
icon: puzzle
---

## Exemple de configuration

```nginx
user www www;
worker_processes 2;

error_log /var/log/nginx-error.log info;

events {
    use kqueue;
    worker_connections 2048;
}

...
```

## Directives

- [[12-directives/accept-mutex|accept_mutex]]
- [[12-directives/accept-mutex-delay|accept_mutex_delay]]
- [[12-directives/daemon|daemon]]
- [[12-directives/debug-connection|debug_connection]]
- [[12-directives/debug-points|debug_points]]
- [[12-directives/env|env]]
- [[12-directives/error-log|error_log]]
- [[12-directives/events|events]]
- [[12-directives/include|include]]
- [[12-directives/load-module|load_module]]
- [[12-directives/lock-file|lock_file]]
- [[12-directives/master-process|master_process]]
- [[12-directives/multi-accept|multi_accept]]
- [[12-directives/pcre-jit|pcre_jit]]
- [[12-directives/pid|pid]]
- [[12-directives/ssl-engine|ssl_engine]]
- [[12-directives/ssl-object-cache-inheritable|ssl_object_cache_inheritable]]
- [[12-directives/stall-threshold|stall_threshold]]
- [[12-directives/thread-pool|thread_pool]]
- [[12-directives/timer-resolution|timer_resolution]]
- [[12-directives/use|use]]
- [[12-directives/user|user]]
- [[12-directives/worker-aio-requests|worker_aio_requests]]
- [[12-directives/worker-connections|worker_connections]]
- [[12-directives/worker-cpu-affinity|worker_cpu_affinity]]
- [[12-directives/worker-priority|worker_priority]]
- [[12-directives/worker-processes|worker_processes]]
- [[12-directives/worker-rlimit-core|worker_rlimit_core]]
- [[12-directives/worker-rlimit-nofile|worker_rlimit_nofile]]
- [[12-directives/worker-shutdown-timeout|worker_shutdown_timeout]]
- [[12-directives/working-directory|working_directory]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

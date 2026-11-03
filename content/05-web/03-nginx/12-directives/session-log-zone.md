---
title: "session_log_zone"
description: "Directive nginx session_log_zone (ngx_http_session_log_module) — Sets the path to a log file and configures the shared memory zone that is used to store currently active sessions. A session is considered active for as long as the time elapsed since the last…"
tags: [nginx, directive, ngx_http_session_log_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_log_zone path zone=name:size [format=format] [timeout=time] [id=id] [md5=md5];` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_session_log_module\|ngx_http_session_log_module]] |

## Utilisation

Sets the path to a log file and configures the shared memory zone that is used to store currently active sessions.

A session is considered active for as long as the time elapsed since the last request in the session does not exceed the specified `timeout` (by default, 30 seconds). Once a session is no longer active, it is written to the log.

The `id` parameter identifies the session to which a request is mapped. The `id` parameter is set to the hexadecimal representation of an MD5 hash (for example, obtained from a cookie using variables). If this parameter is not specified or does not represent the valid MD5 hash, nginx computes the MD5 hash from the value of the `md5` parameter and creates a new session using this hash. Both the `id` and `md5` parameters can contain variables.

The `format` parameter sets the custom session log format configured by the [[12-directives/session-log-format|session_log_format]] directive. If `format` is not specified, the predefined “`combined`” format is used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

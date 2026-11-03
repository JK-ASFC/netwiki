---
title: "error_log"
description: "Directive nginx error_log (Core functionality) — Configures logging. Several logs can be specified on the same configuration level (1.5.2). If on the main configuration level writing a log to a file is not explicitly defined, the default file will…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `error_log file [level] [json];` |
| **Valeur par défaut** | `error_log logs/error.log error;` |
| **Contexte** | `main`, `http`, `mail`, `stream`, `server`, `location` |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

Configures logging. Several logs can be specified on the same configuration level (1.5.2). If on the `main` configuration level writing a log to a file is not explicitly defined, the default file will be used.

The first parameter defines a *file* that will store the log. The special value `stderr` selects the standard error file. Logging to [[10-guides/01-introduction/syslog|syslog]] can be configured by specifying the “`syslog:`” prefix. Logging to a [[10-guides/01-introduction/debugging-log|cyclic memory buffer]] can be configured by specifying the “`memory:`” prefix and buffer *size*, and is generally used for debugging (1.7.11).

The second parameter determines the *level* of logging, and can be one of the following: `debug`, `info`, `notice`, `warn`, `error`, `crit`, `alert`, or `emerg`. Log levels above are listed in the order of increasing severity. Setting a certain log level will cause all messages of the specified and more severe log levels to be logged. For example, the default level `error` will cause `error`, `crit`, `alert`, and `emerg` messages to be logged. If this parameter is omitted then `error` is used.

> [!NOTE]
> For `debug` logging to work, nginx needs to be built with `--with-debug`, see “[[10-guides/01-introduction/debugging-log|A debugging log]]”.

The `json` parameter (1.29.8) enables writing a log in the JSON format, with support for [[12-directives/error-log-tag|context tags]]:

```nginx
{
  "level": "error",
  "timestamp": "2026-05-13T10:30:15.042+00:00",
  "pid": 12345,  "tid": 12345,  "cnum": 3,
  "msg": "connect() failed",
  "client": "192.168.1.10",  "server": "example.com",
  "request": "GET /api HTTP/1.1",
  "upstream": "http://127.0.0.1:8080/api",
  "errno": 111,
  "errtext": "Connection refused"
}
```

A log entry cannot exceed 2 KB, data beyond this limit is truncated to `“truncated”:1`. Debug logging is not supported for JSON.

> [!NOTE]
> This parameter is available as part of our [abonnement commercial](https://nginx.com/products/).

> [!NOTE]
> The directive can be specified on the `stream` level starting from version 1.7.11, and on the `mail` level starting from version 1.9.0.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

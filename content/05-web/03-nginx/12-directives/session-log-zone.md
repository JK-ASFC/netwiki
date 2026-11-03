---
title: "session_log_zone"
description: "Directive nginx session_log_zone (ngx_http_session_log_module) — Définit le chemin du fichier journal et configure la zone de mémoire partagée qui stocke les sessions actives. Une session est considérée comme active tant que le temps écoulé depuis sa dernière…"
tags: [nginx, directive, ngx_http_session_log_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_log_zone path zone=name:size [format=format] [timeout=time] [id=id] [md5=md5];` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_session_log_module\|ngx_http_session_log_module]] |

## Utilisation

Définit le chemin du fichier journal et configure la zone de mémoire partagée qui stocke les sessions actives.

Une session est considérée comme active tant que le temps écoulé depuis sa dernière requête ne dépasse pas le délai `timeout` indiqué (30 secondes par défaut). Une fois inactive, elle est écrite dans le journal.

Le paramètre `id` identifie la session à laquelle la requête est associée. Il contient la représentation hexadécimale d'une empreinte MD5 (obtenue par exemple d'un cookie à l'aide de variables). S'il n'est pas indiqué ou n'est pas une empreinte MD5 valide, nginx calcule l'empreinte MD5 de la valeur du paramètre `md5` et crée une nouvelle session avec cette empreinte. Les paramètres `id` et `md5` peuvent contenir des variables.

Le paramètre `format` définit le format personnalisé du journal de sessions configuré par la directive [[12-directives/session-log-format|session_log_format]]. Sans `format`, le format prédéfini « `combined` » est utilisé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "log_format (ngx_http_log_module)"
description: "Directive nginx log_format (ngx_http_log_module) — Définit le format du journal. Le paramètre escape (1.11.8) permet de choisir l'échappement des caractères dans les variables : json ou default (par défaut). La valeur none (1.13.10) désactive…"
tags: [nginx, directive, ngx_http_log_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `log_format name [escape=default\|json\|none] string ...;` |
| **Valeur par défaut** | `log_format combined "...";` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_log_module\|ngx_http_log_module]] |

## Utilisation

Définit le format du journal.

Le paramètre `escape` (1.11.8) permet de choisir l'échappement des caractères dans les variables : `json` ou `default` (par défaut). La valeur `none` (1.13.10) désactive l'échappement.

Avec l'échappement `default`, les caractères « `"` », « `\` » et les autres caractères de valeur inférieure à 32 (0.7.0) ou supérieure à 126 (1.1.6) sont échappés sous la forme « `\xXX` ». Si la valeur de la variable est introuvable, un tiret (« `-` ») est journalisé.

Avec l'échappement `json`, tous les caractères interdits dans les [chaînes](https://datatracker.ietf.org/doc/html/rfc8259#section-7) JSON sont échappés : les caractères « `"` » et « `\` » deviennent « `\"` » et « `\\` », les caractères de valeur inférieure à 32 deviennent « `\n` », « `\r` », « `\t` », « `\b` », « `\f` » ou « `\u00XX` ».

Le format du journal peut contenir les variables courantes ainsi que des variables qui n'existent qu'au moment de l'écriture du journal :

- **`$bytes_sent`**

  le nombre d'octets envoyés au client

- **`$connection`**

  numéro de série de la connexion

- **`$connection_requests`**

  le nombre actuel de requêtes faites sur une connexion (1.1.18)

- **`$msec`**

  heure en secondes, avec une résolution à la milliseconde, au moment de l'écriture du journal

- **`$pipe`**

  « `p` » si la requête a été envoyée en pipeline, « `.` » sinon

- **`$request_length`**

  longueur de la requête (ligne de requête, en-tête et corps compris)

- **`$request_time`**

  durée de traitement de la requête en secondes, avec une résolution à la milliseconde : temps écoulé entre la lecture des premiers octets envoyés par le client et l'écriture du journal après l'envoi des derniers octets au client

- **`$status`**

  statut de la réponse

- **`$time_iso8601`**

  heure locale au format standard ISO 8601

- **`$time_local`**

  heure locale au format Common Log Format

> [!NOTE]
> Dans les versions récentes de nginx, les variables [[13-variables/status-http-core|$status]] (1.3.2, 1.2.2), [[13-variables/bytes-sent-http-core|$bytes_sent]] (1.3.8, 1.2.5), [[13-variables/connection-http-core|$connection]] (1.3.8, 1.2.5), [[13-variables/connection-requests|$connection_requests]] (1.3.8, 1.2.5), [[13-variables/msec-http-core|$msec]] (1.3.9, 1.2.6), [[13-variables/request-time|$request_time]] (1.3.9, 1.2.6), [[13-variables/pipe|$pipe]] (1.3.12, 1.2.7), [[13-variables/request-length|$request_length]] (1.3.12, 1.2.7), [[13-variables/time-iso8601-http-core|$time_iso8601]] (1.3.12, 1.2.7) et [[13-variables/time-local-http-core|$time_local]] (1.3.12, 1.2.7) sont aussi disponibles comme variables courantes.

Les lignes d'en-tête envoyées au client portent le préfixe « `sent_http_` », par exemple `$sent_http_content_range`.

La configuration contient toujours le format prédéfini « `combined` » :

```nginx
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

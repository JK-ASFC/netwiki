---
title: "error_log"
description: "Directive nginx error_log (ngx_core_module) — Configure la journalisation. Plusieurs journaux peuvent être définis au même niveau de configuration (1.5.2). Si l'écriture d'un journal dans un fichier n'est pas définie explicitement au niveau de…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `error_log file [level] [json];` |
| **Valeur par défaut** | `error_log logs/error.log error;` |
| **Contexte** | `main`, `http`, `mail`, `stream`, `server`, `location` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Configure la journalisation. Plusieurs journaux peuvent être définis au même niveau de configuration (1.5.2). Si l'écriture d'un journal dans un fichier n'est pas définie explicitement au niveau de configuration `main`, le fichier par défaut est utilisé.

Le premier paramètre définit le fichier (*file*) qui contiendra le journal. La valeur spéciale `stderr` désigne la sortie d'erreur standard. La journalisation vers [[10-guides/01-introduction/syslog|syslog]] se configure avec le préfixe « `syslog:` ». La journalisation dans un [[10-guides/01-introduction/debugging-log|tampon mémoire circulaire]] se configure avec le préfixe « `memory:` » suivi de la taille (*size*) du tampon ; elle sert généralement au débogage (1.7.11).

Le second paramètre détermine le niveau (*level*) de journalisation : `debug`, `info`, `notice`, `warn`, `error`, `crit`, `alert` ou `emerg`. Ces niveaux sont listés par gravité croissante. Choisir un niveau journalise les messages de ce niveau et de tous les niveaux plus graves. Par exemple, le niveau par défaut `error` journalise les messages `error`, `crit`, `alert` et `emerg`. Si ce paramètre est omis, `error` est utilisé.

> [!NOTE]
> Pour que la journalisation `debug` fonctionne, nginx doit être compilé avec `--with-debug` ; voir « [[10-guides/01-introduction/debugging-log|Le journal de débogage]] ».

Le paramètre `json` (1.29.8) active l'écriture du journal au format JSON, avec prise en charge des [[12-directives/error-log-tag|étiquettes de contexte]] :

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

Une entrée de journal ne peut pas dépasser 2 Ko ; les données au-delà de cette limite sont tronquées et remplacées par `“truncated”:1`. La journalisation de débogage n'est pas prise en charge en JSON.

> [!NOTE]
> Ce paramètre est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

> [!NOTE]
> La directive peut être indiquée au niveau `stream` à partir de la version 1.7.11 et au niveau `mail` à partir de la version 1.9.0.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

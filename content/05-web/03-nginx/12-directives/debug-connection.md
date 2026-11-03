---
title: "debug_connection"
description: "Directive nginx debug_connection (ngx_core_module) — Active le journal de débogage pour certaines connexions clientes. Les autres connexions utilisent le niveau de journalisation défini par la directive error_log. Les connexions déboguées sont…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `debug_connection address \| CIDR \| unix:;` |
| **Valeur par défaut** | — |
| **Contexte** | `events` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Active le journal de débogage pour certaines connexions clientes. Les autres connexions utilisent le niveau de journalisation défini par la directive [[12-directives/error-log|error_log]]. Les connexions déboguées sont désignées par une adresse ou un réseau IPv4 ou IPv6 (1.3.0, 1.2.1). Une connexion peut aussi être désignée par un nom d'hôte. Pour les connexions par sockets de domaine UNIX (1.3.0, 1.2.1), le journal de débogage est activé par le paramètre « `unix:` ».

```nginx
events {
    debug_connection 127.0.0.1;
    debug_connection localhost;
    debug_connection 192.0.2.0/24;
    debug_connection ::1;
    debug_connection 2001:0db8::/32;
    debug_connection unix:;
    ...
}
```

> [!NOTE]
> Pour que cette directive fonctionne, nginx doit être compilé avec `--with-debug` ; voir « [[10-guides/01-introduction/debugging-log|Le journal de débogage]] ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

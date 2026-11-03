---
title: "worker_cpu_affinity"
description: "Directive nginx worker_cpu_affinity (ngx_core_module) — Associe les processus de travail à des ensembles de processeurs. Chaque ensemble est représenté par un masque de bits des processeurs autorisés. Un ensemble distinct doit être défini pour chaque…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `worker_cpu_affinity cpumask ...;` ou `worker_cpu_affinity auto [cpumask];` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Associe les processus de travail à des ensembles de processeurs. Chaque ensemble est représenté par un masque de bits des processeurs autorisés. Un ensemble distinct doit être défini pour chaque processus de travail. Par défaut, les processus de travail ne sont associés à aucun processeur particulier.

Par exemple,

```nginx
worker_processes    4;
worker_cpu_affinity 0001 0010 0100 1000;
```

associe chaque processus de travail à un processeur distinct, tandis que

```nginx
worker_processes    2;
worker_cpu_affinity 0101 1010;
```

associe le premier processus de travail à CPU0/CPU2 et le second à CPU1/CPU3. Le second exemple convient à l'hyper-threading.

La valeur spéciale `auto` (1.9.10) associe automatiquement les processus de travail aux processeurs disponibles :

```nginx
worker_processes auto;
worker_cpu_affinity auto;
```

Le paramètre facultatif de masque permet de limiter les processeurs disponibles pour l'association automatique :

```nginx
worker_cpu_affinity auto 01010101;
```

> [!NOTE]
> Cette directive n'est disponible que sous FreeBSD et Linux.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

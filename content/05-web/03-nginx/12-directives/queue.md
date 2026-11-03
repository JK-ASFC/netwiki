---
title: "queue"
description: "Directive nginx queue (ngx_http_upstream_module) — Si aucun serveur amont ne peut être choisi immédiatement pendant le traitement d'une requête, celle-ci est placée dans la file d'attente. La directive indique le nombre (number) maximal de requêtes…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `queue number [timeout=time];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.5.12 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Si aucun serveur amont ne peut être choisi immédiatement pendant le traitement d'une requête, celle-ci est placée dans la file d'attente. La directive indique le nombre (*number*) maximal de requêtes pouvant se trouver simultanément dans la file. Si la file est pleine, ou si aucun serveur ne peut être choisi dans le délai indiqué par le paramètre `timeout`, l'erreur `502 Bad Gateway` est renvoyée au client.

La valeur par défaut du paramètre `timeout` est de 60 secondes.

> [!NOTE]
> Avec une méthode de répartition autre que le tourniquet par défaut, il faut l'activer avant la directive `queue`.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

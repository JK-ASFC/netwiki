---
title: "resolver (ngx_http_core_module)"
description: "Directive nginx resolver (ngx_http_core_module) — Configure les serveurs de noms utilisés pour résoudre en adresses les noms des serveurs amont, par exemple : nginx resolver 127.0.0.1 ::1:5353; L'adresse peut être un nom de domaine ou une adresse…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver address ... [valid=time] [ipv4=on\|off] [ipv6=on\|off] [status_zone=zone];` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Configure les serveurs de noms utilisés pour résoudre en adresses les noms des serveurs amont, par exemple :

```nginx
resolver 127.0.0.1 [::1]:5353;
```

L'adresse peut être un nom de domaine ou une adresse IP, avec un port facultatif (1.3.1, 1.2.2). Sans port, le port 53 est utilisé. Les serveurs de noms sont interrogés à tour de rôle.

> [!NOTE]
> Avant la version 1.1.7, un seul serveur de noms pouvait être configuré. L'indication de serveurs de noms par adresse IPv6 est prise en charge à partir des versions 1.3.1 et 1.2.2.

Par défaut, nginx recherche à la fois les adresses IPv4 et IPv6 lors de la résolution. Si l'on ne souhaite pas rechercher les adresses IPv4 ou IPv6, on peut indiquer le paramètre `ipv4=off` (1.23.1) ou `ipv6=off`.

> [!NOTE]
> La résolution de noms en adresses IPv6 est prise en charge à partir de la version 1.5.8.

Par défaut, nginx met les réponses en cache selon la valeur TTL de la réponse. Le paramètre facultatif `valid` permet de la remplacer :

```nginx
resolver 127.0.0.1 [::1]:5353 valid=30s;
```

> [!NOTE]
> Avant la version 1.1.9, la durée de mise en cache n'était pas réglable et nginx mettait toujours les réponses en cache pendant 5 minutes.

> [!NOTE]
> Pour éviter l'usurpation DNS, il est recommandé de configurer des serveurs DNS dans un réseau local de confiance correctement sécurisé.

Le paramètre facultatif `status_zone` (1.17.1) active la [[11-modules/02-http/ngx_http_api_module|collecte]] des statistiques de requêtes et de réponses des serveurs DNS dans la zone (*zone*) indiquée. Ce paramètre est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

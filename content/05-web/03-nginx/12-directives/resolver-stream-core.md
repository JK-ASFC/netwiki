---
title: "resolver (ngx_stream_core_module)"
description: "Directive nginx resolver (ngx_stream_core_module) — Configure les serveurs de noms utilisés pour résoudre en adresses les noms des serveurs amont, par exemple : nginx resolver 127.0.0.1 ::1:5353; L'adresse peut être un nom de domaine ou une adresse…"
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver address ... [valid=time] [ipv4=on\|off] [ipv6=on\|off] [status_zone=zone];` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.3 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Configure les serveurs de noms utilisés pour résoudre en adresses les noms des serveurs amont, par exemple :

```nginx
resolver 127.0.0.1 [::1]:5353;
```

L'adresse peut être un nom de domaine ou une adresse IP, avec un port facultatif. Sans port, le port 53 est utilisé. Les serveurs de noms sont interrogés à tour de rôle.

Par défaut, nginx recherche à la fois les adresses IPv4 et IPv6 lors de la résolution. Si l'on ne souhaite pas rechercher les adresses IPv4 ou IPv6, on peut indiquer le paramètre `ipv4=off` (1.23.1) ou `ipv6=off`.

Par défaut, nginx met les réponses en cache selon leur TTL. Le paramètre facultatif `valid` permet de le remplacer :

```nginx
resolver 127.0.0.1 [::1]:5353 valid=30s;
```

> [!NOTE]
> Pour éviter l'usurpation DNS, il est recommandé de configurer des serveurs DNS dans un réseau local de confiance correctement sécurisé.

Le paramètre facultatif `status_zone` (1.17.1) active la [[11-modules/02-http/ngx_http_api_module|collecte]] des statistiques de requêtes et de réponses des serveurs DNS dans la zone (*zone*) indiquée. Ce paramètre est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

> [!NOTE]
> Avant la version 1.11.3, cette directive faisait partie de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "resolver (ngx_http_upstream_module)"
description: "Directive nginx resolver (ngx_http_upstream_module) — Configure les serveurs de noms utilisés pour résoudre en adresses les noms des serveurs amont, par exemple : nginx resolver 127.0.0.1 ::1:5353; The address can be specified as a domain name or IP…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `resolver address ... [valid=time] [ipv4=on\|off] [ipv6=on\|off] [status_zone=zone];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.27.3 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Configure les serveurs de noms utilisés pour résoudre en adresses les noms des serveurs amont, par exemple :

```nginx
resolver 127.0.0.1 [::1]:5353;
```

The address can be specified as a domain name or IP address, with an optional port. If port is not specified, the port 53 is used. Name servers are queried in a round-robin fashion.

Par défaut, nginx recherche à la fois les adresses IPv4 et IPv6 lors de la résolution. Si l'on ne souhaite pas rechercher les adresses IPv4 ou IPv6, on peut indiquer le paramètre `ipv4=off` (1.23.1) ou `ipv6=off`.

Par défaut, nginx met les réponses en cache selon la valeur TTL de la réponse. Le paramètre facultatif `valid` permet de la remplacer :

```nginx
resolver 127.0.0.1 [::1]:5353 valid=30s;
```

> [!NOTE]
> Pour éviter l'usurpation DNS, il est recommandé de configurer des serveurs DNS dans un réseau local de confiance correctement sécurisé.

The optional `status_zone` parameter (1.17.5) enables [[11-modules/02-http/ngx_http_api_module|collection]] of DNS server statistics of requests and responses in the specified *zone*. The parameter is available as part of our [abonnement commercial](https://nginx.com/products/).

> [!NOTE]
> Since version 1.17.5 and prior to version 1.27.3, this directive was available only as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

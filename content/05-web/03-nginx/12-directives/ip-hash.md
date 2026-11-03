---
title: "ip_hash"
description: "Directive nginx ip_hash (ngx_http_upstream_module) — Indique que le groupe utilise une méthode de répartition de charge selon l'adresse IP du client. Les trois premiers octets de l'adresse IPv4 du client, ou l'adresse IPv6 entière, servent de clé de…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ip_hash;` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Indique que le groupe utilise une méthode de répartition de charge selon l'adresse IP du client. Les trois premiers octets de l'adresse IPv4 du client, ou l'adresse IPv6 entière, servent de clé de hachage. Cette méthode garantit que les requêtes d'un même client sont toujours transmises au même serveur, sauf s'il est indisponible ; elles sont alors transmises à un autre serveur, très probablement toujours le même lui aussi.

> [!NOTE]
> Les adresses IPv6 sont prises en charge à partir des versions 1.3.2 et 1.2.2.

Pour retirer temporairement un serveur, il faut le marquer avec le paramètre `down` afin de conserver le hachage actuel des adresses IP des clients.

Exemple :

```nginx
upstream backend {
    ip_hash;

    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com down;
    server backend4.example.com;
}
```

> [!NOTE]
> Jusqu'aux versions 1.3.1 et 1.2.2, il n'était pas possible d'indiquer un poids pour les serveurs avec la méthode de répartition `ip_hash`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

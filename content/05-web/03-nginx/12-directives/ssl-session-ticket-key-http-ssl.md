---
title: "ssl_session_ticket_key (ngx_http_ssl_module)"
description: "Directive nginx ssl_session_ticket_key (ngx_http_ssl_module) — Indique le fichier (file) contenant la clé secrète servant à chiffrer et déchiffrer les tickets de session TLS. Cette directive est nécessaire si la même clé doit être partagée entre plusieurs…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_session_ticket_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.5.7 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Indique le fichier (*file*) contenant la clé secrète servant à chiffrer et déchiffrer les tickets de session TLS. Cette directive est nécessaire si la même clé doit être partagée entre plusieurs serveurs. Par défaut, une clé générée aléatoirement est utilisée.

Si plusieurs clés sont indiquées, seule la première sert à chiffrer les tickets de session TLS. Cela permet de configurer un renouvellement des clés, par exemple :

```nginx
ssl_session_ticket_key current.key;
ssl_session_ticket_key previous.key;
```

Le fichier (*file*) doit contenir 80 ou 48 octets de données aléatoires et peut être créé avec la commande suivante :

```nginx
openssl rand 80 > ticket.key
```

Selon la taille du fichier, le chiffrement utilise AES256 (clés de 80 octets, 1.11.8) ou AES128 (clés de 48 octets).

Si la directive est indiquée au niveau [[12-directives/server-http-core|server]], la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la section « [[10-guides/02-http/server-names|Choix du serveur virtuel]] ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

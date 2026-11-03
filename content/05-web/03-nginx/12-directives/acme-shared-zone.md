---
title: "acme_shared_zone"
description: "Directive nginx acme_shared_zone (ngx_http_acme_module) — Permet d'augmenter la taille du stockage en mémoire du module. La zone de mémoire partagée conserve les certificats émis, les clés et les données de défi de tous les émetteurs configurés. La taille…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `acme_shared_zone zone=name:size;` |
| **Valeur par défaut** | `acme_shared_zone zone=ngx_acme_shared:256k;` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Permet d'augmenter la taille du stockage en mémoire du module. La zone de mémoire partagée conserve les certificats émis, les clés et les données de défi de tous les émetteurs configurés.

La taille par défaut de la zone suffit pour environ 50 clés ECDSA prime256v1 ou 35 clés RSA 2048.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

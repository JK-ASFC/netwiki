---
title: "account_key"
description: "Directive nginx account_key (ngx_http_acme_module) — Clé privée du compte, utilisée pour authentifier les requêtes. Valeurs acceptées : - ecdsa:256/384/521 pour les algorithmes JSON Web Signature ES256, ES384 ou ES512 - rsa:2048/3072/4096 pour RS256. -…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `account_key alg[:size] \| file;` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Clé privée du compte, utilisée pour authentifier les requêtes.

Valeurs acceptées :

- `ecdsa`:*256*/*384*/*521* pour les algorithmes JSON Web Signature ES256, ES384 ou ES512
- `rsa`:*2048*/*3072*/*4096* pour RS256.
- Chemin d'une clé existante utilisant l'un des algorithmes ci-dessus.

Les clés de compte générées sont conservées lors des rechargements, mais perdues au redémarrage si [[12-directives/state-path-http-acme|state_path]] n'est pas configuré.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

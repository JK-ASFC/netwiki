---
title: "ssl_crl (ngx_mgmt_module)"
description: "Directive nginx ssl_crl (ngx_mgmt_module) — Indique le fichier (file) contenant les certificats révoqués (CRL) au format PEM utilisé pour vérifier le certificat du point de terminaison du rapport d'utilisation. Avec des certificats…"
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `mgmt` |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats révoqués (CRL) au format PEM utilisé pour [[12-directives/ssl-verify-mgmt|vérifier]] le certificat du point de terminaison du rapport d'utilisation. Avec des certificats intermédiaires, leurs CRL doivent figurer dans le même fichier.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

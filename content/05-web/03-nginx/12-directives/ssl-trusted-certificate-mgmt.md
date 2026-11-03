---
title: "ssl_trusted_certificate (ngx_mgmt_module)"
description: "Directive nginx ssl_trusted_certificate (ngx_mgmt_module) — Indique le fichier (file) contenant les certificats d'autorités de confiance au format PEM utilisé pour vérifier le certificat du point de terminaison du rapport d'utilisation."
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_trusted_certificate file;` |
| **Valeur par défaut** | `ssl_trusted_certificate system CA bundle;` |
| **Contexte** | `mgmt` |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Indique le fichier (*file*) contenant les certificats d'autorités de confiance au format PEM utilisé pour [[12-directives/ssl-verify-mgmt|vérifier]] le certificat du point de terminaison du rapport d'utilisation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "common_name_in_csr"
description: "Directive nginx common_name_in_csr (ngx_http_acme_module) — Si cette option est activée, le nom commun du sujet (Subject Common Name) de la demande de certificat est défini sur le premier nom DNS ou la première adresse IP fournis. NOTE Activer cette option…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `common_name_in_csr on \| off;` |
| **Valeur par défaut** | `common_name_in_csr off;` |
| **Contexte** | `acme_issuer` |
| **Apparue dans la version** | 0.4.0 |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Si cette option est activée, le nom commun du sujet (*Subject Common Name*) de la demande de certificat est défini sur le premier nom DNS ou la première adresse IP fournis.

> [!NOTE]
> Activer cette option peut entraîner le rejet des demandes de certificat.

> [!NOTE]
> Avant la version 0.4.0, le nom commun du sujet était toujours défini.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

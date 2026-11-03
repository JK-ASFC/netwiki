---
title: "preferred_chain"
description: "Directive nginx preferred_chain (ngx_http_acme_module) — Specifies the preferred certificate chain. If the ACME server offers multiple certificate chains, prefer the chain with the topmost certificate issued from the Subject Common Name name. If there are…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `preferred_chain name;` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Apparue dans la version** | 0.3.0 |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Specifies the preferred certificate chain.

If the ACME server offers multiple certificate chains, prefer the chain with the topmost certificate issued from the Subject Common Name *name*. If there are no matches, the default chain will be used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

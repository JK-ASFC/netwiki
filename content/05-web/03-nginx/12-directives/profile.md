---
title: "profile"
description: "Directive nginx profile (ngx_http_acme_module) — Demande au serveur ACME le profil de certificat name. Avec le paramètre require, le renouvellement des certificats échoue si le serveur ne prend pas en charge le profil indiqué."
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `profile name [require];` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Apparue dans la version** | 0.3.0 |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Demande au serveur ACME le [profil de certificat](https://datatracker.ietf.org/doc/html/draft-ietf-acme-profiles) *name*.

Avec le paramètre `require`, le renouvellement des certificats échoue si le serveur ne prend pas en charge le profil indiqué.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

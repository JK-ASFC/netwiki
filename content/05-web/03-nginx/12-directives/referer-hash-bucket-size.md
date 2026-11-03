---
title: "referer_hash_bucket_size"
description: "Directive nginx referer_hash_bucket_size (ngx_http_referer_module) — Sets the bucket size for the valid referers hash tables. The details of setting up hash tables are provided in a separate document."
tags: [nginx, directive, ngx_http_referer_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `referer_hash_bucket_size size;` |
| **Valeur par défaut** | `referer_hash_bucket_size 64;` |
| **Contexte** | `server`, `location` |
| **Apparue dans la version** | 1.0.5 |
| **Module** | [[11-modules/02-http/ngx_http_referer_module\|ngx_http_referer_module]] |

## Utilisation

Sets the bucket size for the valid referers hash tables. The details of setting up hash tables are provided in a separate [[10-guides/01-introduction/hash|document]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

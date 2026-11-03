---
title: "secure_link"
description: "Directive nginx secure_link (ngx_http_secure_link_module) — Définit une chaîne avec variables d'où sont extraites la somme de contrôle et la durée de vie du lien. Les variables utilisées dans expression sont généralement liées à la requête ; voir l'exemple…"
tags: [nginx, directive, ngx_http_secure_link_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `secure_link expression;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_secure_link_module\|ngx_http_secure_link_module]] |

## Utilisation

Définit une chaîne avec variables d'où sont extraites la somme de contrôle et la durée de vie du lien.

Les variables utilisées dans *expression* sont généralement liées à la requête ; voir l'[[12-directives/secure-link-md5|exemple]] ci-dessous.

La somme de contrôle extraite de la chaîne est comparée à l'empreinte MD5 de l'expression définie par la directive [[12-directives/secure-link-md5|secure_link_md5]]. Si elles diffèrent, la variable `$secure_link` vaut une chaîne vide. Si elles sont identiques, la durée de vie du lien est vérifiée : si elle est limitée et dépassée, `$secure_link` vaut « `0` » ; sinon, « `1` ». L'empreinte MD5 transmise dans la requête est encodée en [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5).

Si le lien a une durée de vie limitée, l'heure d'expiration s'exprime en secondes depuis l'Epoch (Thu, 01 Jan 1970 00:00:00 GMT). Elle figure dans l'expression après l'empreinte MD5, séparée par une virgule. L'heure d'expiration transmise dans la requête est disponible dans la variable `$secure_link_expires` pour la directive [[12-directives/secure-link-md5|secure_link_md5]]. Sans heure d'expiration, le lien a une durée de vie illimitée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

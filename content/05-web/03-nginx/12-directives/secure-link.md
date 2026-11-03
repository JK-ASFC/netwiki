---
title: "secure_link"
description: "Directive nginx secure_link (ngx_http_secure_link_module) — Defines a string with variables from which the checksum value and lifetime of a link will be extracted. Variables used in an expression are usually associated with a request; see example below. The…"
tags: [nginx, directive, ngx_http_secure_link_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `secure_link expression;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_secure_link_module\|ngx_http_secure_link_module]] |

## Utilisation

Defines a string with variables from which the checksum value and lifetime of a link will be extracted.

Variables used in an *expression* are usually associated with a request; see [[12-directives/secure-link-md5|example]] below.

The checksum value extracted from the string is compared with the MD5 hash value of the expression defined by the [[12-directives/secure-link-md5|secure_link_md5]] directive. If the checksums are different, the `$secure_link` variable is set to an empty string. If the checksums are the same, the link lifetime is checked. If the link has a limited lifetime and the time has expired, the `$secure_link` variable is set to “`0`”. Otherwise, it is set to “`1`”. The MD5 hash value passed in a request is encoded in [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5).

If a link has a limited lifetime, the expiration time is set in seconds since Epoch (Thu, 01 Jan 1970 00:00:00 GMT). The value is specified in the expression after the MD5 hash, and is separated by a comma. The expiration time passed in a request is available through the `$secure_link_expires` variable for a use in the [[12-directives/secure-link-md5|secure_link_md5]] directive. If the expiration time is not specified, a link has the unlimited lifetime.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

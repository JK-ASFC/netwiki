---
title: "Security"
description: "Nginx — Security. All nginx security issues should be reported via one of the methods listed here."
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

All nginx security issues should be reported via one of the methods listed [here](https://github.com/nginx/njs/blob/master/SECURITY.md).

Patches are signed using one of the PGP public keys.

## Special considerations

njs does not evaluate dynamic code, especially code received from the network, in any way. The only way to evaluate that code using njs is to configure the [[12-directives/js-import-http-js|js_import]] directive in nginx. JavaScript code is loaded once during nginx start.

In the nginx/njs threat model, JavaScript code is considered a trusted source in the same way as `nginx.conf` and sites certificates. What this means in practice:

- memory disclosure and other security issues triggered by JavaScript code modification are not considered security vulnerabilities, but rather ordinary bugs
- measures should be taken for protecting JavaScript code used by njs
- if no [[12-directives/js-import-http-js|js_import]] directives are present in `nginx.conf`, nginx is safe from JavaScript-related vulnerabilities

## Advisories

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

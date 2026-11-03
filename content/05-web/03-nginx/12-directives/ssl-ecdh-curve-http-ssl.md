---
title: "ssl_ecdh_curve (ngx_http_ssl_module)"
description: "Directive nginx ssl_ecdh_curve (ngx_http_ssl_module) — Indique la courbe (curve) pour les suites de chiffrement ECDHE. Avec OpenSSL 1.0.2 ou plus récent, on peut indiquer plusieurs courbes (1.11.0), par exemple : nginx ssl_ecdh_curve…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ecdh_curve curve;` |
| **Valeur par défaut** | `ssl_ecdh_curve auto;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.1.0, 1.0.6 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Indique la courbe (*curve*) pour les suites de chiffrement ECDHE.

Avec OpenSSL 1.0.2 ou plus récent, on peut indiquer plusieurs courbes (1.11.0), par exemple :

```nginx
ssl_ecdh_curve prime256v1:secp384r1;
```

La valeur spéciale `auto` (1.11.0) demande à nginx d'utiliser la liste intégrée à OpenSSL avec OpenSSL 1.0.2 ou plus récent, ou `prime256v1` avec les versions plus anciennes.

> [!NOTE]
> Avant la version 1.11.0, la courbe `prime256v1` était utilisée par défaut.

> [!NOTE]
> Avec OpenSSL 1.0.2 ou plus récent, cette directive définit la liste des courbes prises en charge par le serveur. Pour que les certificats ECDSA fonctionnent, il est donc important d'y inclure les courbes utilisées par ces certificats.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

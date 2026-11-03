---
title: "ssl_early_data"
description: "Directive nginx ssl_early_data (ngx_http_ssl_module) — Active ou désactive les données précoces (early data) de TLS 1.3. NOTE Cette directive est prise en charge avec OpenSSL 1.1.1 ou plus récent (1.15.4) et avec BoringSSL. Si la directive est indiquée…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_early_data on \| off;` |
| **Valeur par défaut** | `ssl_early_data off;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.15.3 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Active ou désactive les [données précoces](https://datatracker.ietf.org/doc/html/rfc8446#section-2.3) (*early data*) de TLS 1.3.

> [!NOTE]
> Cette directive est prise en charge avec OpenSSL 1.1.1 ou plus récent (1.15.4) et avec [BoringSSL](https://boringssl.googlesource.com/boringssl/).

Si la directive est indiquée au niveau [[12-directives/server-http-core|server]], la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la section « [[10-guides/02-http/server-names|Choix du serveur virtuel]] ».

> [!NOTE]
> Les requêtes envoyées dans les données précoces sont exposées aux [attaques par rejeu](https://datatracker.ietf.org/doc/html/rfc8470). Pour s'en protéger au niveau de l'application, utiliser la variable [[13-variables/ssl-early-data|$ssl_early_data]].

```nginx
proxy_set_header Early-Data $ssl_early_data;
```

> [!NOTE]
> La protection intégrée d'OpenSSL contre le rejeu est désactivée, car elle gêne la reprise de session. Elle peut être réactivée si nécessaire.

```nginx
ssl_conf_command Options AntiReplay;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

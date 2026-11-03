---
title: "ssl_protocols (ngx_mail_ssl_module)"
description: "Directive nginx ssl_protocols (ngx_mail_ssl_module) — Active les protocoles indiqués. NOTE Les paramètres TLSv1.1 et TLSv1.2 (1.1.13, 1.0.12) ne fonctionnent qu'avec OpenSSL 1.0.1 ou plus récent. NOTE Le paramètre TLSv1.3 (1.13.0) ne fonctionne qu'avec…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_protocols [SSLv2] [SSLv3] [TLSv1] [TLSv1.1] [TLSv1.2] [TLSv1.3];` |
| **Valeur par défaut** | `ssl_protocols TLSv1.2 TLSv1.3;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Active les protocoles indiqués.

> [!NOTE]
> Les paramètres `TLSv1.1` et `TLSv1.2` (1.1.13, 1.0.12) ne fonctionnent qu'avec OpenSSL 1.0.1 ou plus récent.

> [!NOTE]
> Le paramètre `TLSv1.3` (1.13.0) ne fonctionne qu'avec OpenSSL 1.1.1 ou plus récent.

> [!NOTE]
> Le paramètre `TLSv1.3` est utilisé par défaut depuis la version 1.23.4.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

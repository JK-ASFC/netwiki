---
title: "ssl_ciphers (ngx_mail_ssl_module)"
description: "Directive nginx ssl_ciphers (ngx_mail_ssl_module) — Indique les suites de chiffrement activées, au format reconnu par la bibliothèque OpenSSL, par exemple : nginx ssl_ciphers ALL:aNULL:EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP; La liste complète…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ciphers ciphers;` |
| **Valeur par défaut** | `ssl_ciphers HIGH:!aNULL:!MD5;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Indique les suites de chiffrement activées, au format reconnu par la bibliothèque OpenSSL, par exemple :

```nginx
ssl_ciphers ALL:!aNULL:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
```

La liste complète s'affiche avec la commande « `openssl ciphers` ».

> [!NOTE]
> Les versions précédentes de nginx utilisaient par défaut des suites de chiffrement [[10-guides/02-http/configuring-https-servers|différentes]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

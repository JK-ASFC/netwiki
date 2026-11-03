---
title: "proxy_ssl_password_file (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_password_file (ngx_stream_proxy_module) — Specifies a file with passphrases for secret keys where each passphrase is specified on a separate line. Passphrases are tried in turn when loading the key."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_password_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Specifies a *file* with passphrases for [[12-directives/proxy-ssl-certificate-key-stream-proxy|secret keys]] where each passphrase is specified on a separate line. Passphrases are tried in turn when loading the key.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

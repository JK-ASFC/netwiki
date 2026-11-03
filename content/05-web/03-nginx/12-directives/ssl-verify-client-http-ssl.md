---
title: "ssl_verify_client (ngx_http_ssl_module)"
description: "Directive nginx ssl_verify_client (ngx_http_ssl_module) — Active la vérification des certificats des clients. Le résultat est stocké dans la variable $ssl_client_verify. Le paramètre optional (0.8.7+) demande le certificat du client et le vérifie s'il est…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_verify_client on \| off \| optional \| optional_no_ca;` |
| **Valeur par défaut** | `ssl_verify_client off;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Active la vérification des certificats des clients. Le résultat est stocké dans la variable [[13-variables/ssl-client-verify-http-ssl|$ssl_client_verify]].

Le paramètre `optional` (0.8.7+) demande le certificat du client et le vérifie s'il est présent.

Le paramètre `optional_no_ca` (1.3.8, 1.2.5) demande le certificat du client sans exiger qu'il soit signé par une autorité de confiance. Il est destiné aux cas où un service extérieur à nginx effectue la vérification réelle du certificat. Le contenu du certificat est accessible par la variable [[13-variables/ssl-client-cert-http-ssl|$ssl_client_cert]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

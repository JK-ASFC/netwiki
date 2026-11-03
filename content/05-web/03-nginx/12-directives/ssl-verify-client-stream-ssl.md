---
title: "ssl_verify_client (ngx_stream_ssl_module)"
description: "Directive nginx ssl_verify_client (ngx_stream_ssl_module) — Active la vérification des certificats client. Le résultat est stocké dans la variable $ssl_client_verify. Si une erreur survient pendant la vérification ou si le client n'a pas présenté le…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_verify_client on \| off \| optional \| optional_no_ca;` |
| **Valeur par défaut** | `ssl_verify_client off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.8 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Active la vérification des certificats client. Le résultat est stocké dans la variable [[13-variables/ssl-client-verify-stream-ssl|$ssl_client_verify]]. Si une erreur survient pendant la vérification ou si le client n'a pas présenté le certificat requis, la connexion est fermée.

Le paramètre `optional` demande le certificat du client et le vérifie s'il est présent.

Le paramètre `optional_no_ca` demande le certificat client sans exiger qu'il soit signé par un certificat d'AC de confiance. Il est destiné aux cas où un service extérieur à nginx effectue la vérification réelle du certificat. Le contenu du certificat est accessible via la variable [[13-variables/ssl-client-cert-stream-ssl|$ssl_client_cert]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

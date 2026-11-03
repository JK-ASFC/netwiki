---
title: "ssl_verify_client (ngx_mail_ssl_module)"
description: "Directive nginx ssl_verify_client (ngx_mail_ssl_module) — Active la vérification des certificats des clients. Le résultat est transmis dans l'en-tête Auth-SSL-Verify de la requête d'authentification. Le paramètre optional demande le certificat du client et…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_verify_client on \| off \| optional \| optional_no_ca;` |
| **Valeur par défaut** | `ssl_verify_client off;` |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Active la vérification des certificats des clients. Le résultat est transmis dans l'en-tête `Auth-SSL-Verify` de la requête d'[[12-directives/auth-http|authentification]].

Le paramètre `optional` demande le certificat du client et le vérifie s'il est présent.

Le paramètre `optional_no_ca` demande le certificat du client sans exiger qu'il soit signé par une autorité de confiance. Il est destiné aux cas où un service extérieur à nginx effectue la vérification réelle du certificat. Le contenu du certificat est accessible par les requêtes [[12-directives/auth-http-pass-client-cert|envoyées]] au serveur d'authentification.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

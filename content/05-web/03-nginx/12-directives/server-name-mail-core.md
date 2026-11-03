---
title: "server_name (ngx_mail_core_module)"
description: "Directive nginx server_name (ngx_mail_core_module) — Définit le nom de serveur utilisé : - dans le message d'accueil initial du serveur POP3/SMTP ; - dans le sel de l'authentification SASL CRAM-MD5 ; - dans la commande EHLO lors de la connexion au…"
tags: [nginx, directive, ngx_mail_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_name name;` |
| **Valeur par défaut** | `server_name hostname;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_core_module\|ngx_mail_core_module]] |

## Utilisation

Définit le nom de serveur utilisé :

- dans le message d'accueil initial du serveur POP3/SMTP ;
- dans le sel de l'authentification SASL CRAM-MD5 ;
- dans la commande `EHLO` lors de la connexion au serveur SMTP d'arrière-plan, si la transmission de la commande [[12-directives/xclient|XCLIENT]] est activée.

Si la directive n'est pas indiquée, le nom d'hôte de la machine est utilisé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

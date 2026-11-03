---
title: "pop3_capabilities"
description: "Directive nginx pop3_capabilities (ngx_mail_pop3_module) — Définit la liste des extensions du protocole POP3 transmise au client en réponse à la commande CAPA. Les méthodes d'authentification indiquées dans la directive pop3_auth (extension SASL) et STLS…"
tags: [nginx, directive, ngx_mail_pop3_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `pop3_capabilities extension ...;` |
| **Valeur par défaut** | `pop3_capabilities TOP USER UIDL;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_pop3_module\|ngx_mail_pop3_module]] |

## Utilisation

Définit la liste des extensions du [protocole POP3](https://datatracker.ietf.org/doc/html/rfc2449) transmise au client en réponse à la commande `CAPA`. Les méthodes d'authentification indiquées dans la directive [[12-directives/pop3-auth|pop3_auth]] (extension [SASL](https://datatracker.ietf.org/doc/html/rfc2449)) et [STLS](https://datatracker.ietf.org/doc/html/rfc2595) sont ajoutées automatiquement à cette liste selon la valeur de la directive [[12-directives/starttls|starttls]].

Il est utile d'indiquer les extensions prises en charge par les serveurs POP3 d'arrière-plan vers lesquels les clients sont relayés (si elles concernent des commandes utilisées après l'authentification, lorsque nginx relaie de façon transparente la connexion du client).

La liste actuelle des extensions normalisées est publiée sur [www.iana.org](http://www.iana.org/assignments/pop3-extension-mechanism).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

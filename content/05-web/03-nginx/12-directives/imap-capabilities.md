---
title: "imap_capabilities"
description: "Directive nginx imap_capabilities (ngx_mail_imap_module) — Définit la liste des extensions du protocole IMAP transmise au client en réponse à la commande CAPABILITY. Les méthodes d'authentification indiquées dans la directive imap_auth et STARTTLS sont…"
tags: [nginx, directive, ngx_mail_imap_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `imap_capabilities extension ...;` |
| **Valeur par défaut** | `imap_capabilities IMAP4 IMAP4rev1 UIDPLUS;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_imap_module\|ngx_mail_imap_module]] |

## Utilisation

Définit la liste des extensions du [protocole IMAP](https://datatracker.ietf.org/doc/html/rfc3501) transmise au client en réponse à la commande `CAPABILITY`. Les méthodes d'authentification indiquées dans la directive [[12-directives/imap-auth|imap_auth]] et [STARTTLS](https://datatracker.ietf.org/doc/html/rfc2595) sont ajoutées automatiquement à cette liste selon la valeur de la directive [[12-directives/starttls|starttls]].

Il est utile d'indiquer les extensions prises en charge par les serveurs IMAP d'arrière-plan vers lesquels les clients sont relayés (si elles concernent des commandes utilisées après l'authentification, lorsque nginx relaie de façon transparente la connexion du client).

La liste actuelle des extensions normalisées est publiée sur [www.iana.org](http://www.iana.org/assignments/imap4-capabilities).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

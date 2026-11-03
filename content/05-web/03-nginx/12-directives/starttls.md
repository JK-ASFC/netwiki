---
title: "starttls"
description: "Directive nginx starttls (ngx_mail_ssl_module) — - on autorise la commande STLS pour POP3 et la commande STARTTLS pour IMAP et SMTP ; - off interdit les commandes STLS et STARTTLS ; - only exige le passage préalable à TLS."
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `starttls on \| off \| only;` |
| **Valeur par défaut** | `starttls off;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

- **`on`**

  autorise la commande `STLS` pour POP3 et la commande `STARTTLS` pour IMAP et SMTP ;

- **`off`**

  interdit les commandes `STLS` et `STARTTLS` ;

- **`only`**

  exige le passage préalable à TLS.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

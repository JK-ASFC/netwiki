---
title: "imap_auth"
description: "Directive nginx imap_auth (ngx_mail_imap_module) — Définit les méthodes d'authentification autorisées pour les clients IMAP. Les méthodes prises en charge sont : - plain LOGIN, AUTH=PLAIN - login AUTH=LOGIN - cram-md5 AUTH=CRAM-MD5. Pour que cette…"
tags: [nginx, directive, ngx_mail_imap_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `imap_auth method ...;` |
| **Valeur par défaut** | `imap_auth plain;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_imap_module\|ngx_mail_imap_module]] |

## Utilisation

Définit les méthodes d'authentification autorisées pour les clients IMAP. Les méthodes prises en charge sont :

- **`plain`**

  [LOGIN](https://datatracker.ietf.org/doc/html/rfc3501), [AUTH=PLAIN](https://datatracker.ietf.org/doc/html/rfc4616)

- **`login`**

  [AUTH=LOGIN](https://datatracker.ietf.org/doc/html/draft-murchison-sasl-login-00)

- **`cram-md5`**

  [AUTH=CRAM-MD5](https://datatracker.ietf.org/doc/html/rfc2195). Pour que cette méthode fonctionne, le mot de passe doit être stocké en clair.

- **`external`**

  [AUTH=EXTERNAL](https://datatracker.ietf.org/doc/html/rfc4422) (1.11.6).

Les méthodes d'authentification en texte clair (commande `LOGIN`, `AUTH=PLAIN` et `AUTH=LOGIN`) sont toujours activées, mais si les méthodes `plain` et `login` ne sont pas indiquées, `AUTH=PLAIN` et `AUTH=LOGIN` ne sont pas ajoutées automatiquement à [[12-directives/imap-capabilities|imap_capabilities]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

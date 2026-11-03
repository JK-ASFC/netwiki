---
title: "pop3_auth"
description: "Directive nginx pop3_auth (ngx_mail_pop3_module) — Définit les méthodes d'authentification autorisées pour les clients POP3. Les méthodes prises en charge sont : - plain USER/PASS, AUTH PLAIN, AUTH LOGIN - apop APOP. Pour que cette méthode…"
tags: [nginx, directive, ngx_mail_pop3_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `pop3_auth method ...;` |
| **Valeur par défaut** | `pop3_auth plain;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_pop3_module\|ngx_mail_pop3_module]] |

## Utilisation

Définit les méthodes d'authentification autorisées pour les clients POP3. Les méthodes prises en charge sont :

- **`plain`**

  [USER/PASS](https://datatracker.ietf.org/doc/html/rfc1939), [AUTH PLAIN](https://datatracker.ietf.org/doc/html/rfc4616), [AUTH LOGIN](https://datatracker.ietf.org/doc/html/draft-murchison-sasl-login-00)

- **`apop`**

  [APOP](https://datatracker.ietf.org/doc/html/rfc1939). Pour que cette méthode fonctionne, le mot de passe doit être stocké en clair.

- **`cram-md5`**

  [AUTH CRAM-MD5](https://datatracker.ietf.org/doc/html/rfc2195). Pour que cette méthode fonctionne, le mot de passe doit être stocké en clair.

- **`external`**

  [AUTH EXTERNAL](https://datatracker.ietf.org/doc/html/rfc4422) (1.11.6).

Les méthodes d'authentification en texte clair (`USER/PASS`, `AUTH PLAIN` et `AUTH LOGIN`) sont toujours activées, mais si la méthode `plain` n'est pas indiquée, `AUTH PLAIN` et `AUTH LOGIN` ne sont pas ajoutées automatiquement à [[12-directives/pop3-capabilities|pop3_capabilities]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

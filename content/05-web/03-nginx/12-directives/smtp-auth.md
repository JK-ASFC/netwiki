---
title: "smtp_auth"
description: "Directive nginx smtp_auth (ngx_mail_smtp_module) — Définit les méthodes d'authentification SASL autorisées pour les clients SMTP. Les méthodes prises en charge sont : - plain AUTH PLAIN - login AUTH LOGIN - cram-md5 AUTH CRAM-MD5. Pour que cette…"
tags: [nginx, directive, ngx_mail_smtp_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `smtp_auth method ...;` |
| **Valeur par défaut** | `smtp_auth plain login;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_smtp_module\|ngx_mail_smtp_module]] |

## Utilisation

Définit les méthodes d'[authentification SASL](https://datatracker.ietf.org/doc/html/rfc2554) autorisées pour les clients SMTP. Les méthodes prises en charge sont :

- **`plain`**

  [AUTH PLAIN](https://datatracker.ietf.org/doc/html/rfc4616)

- **`login`**

  [AUTH LOGIN](https://datatracker.ietf.org/doc/html/draft-murchison-sasl-login-00)

- **`cram-md5`**

  [AUTH CRAM-MD5](https://datatracker.ietf.org/doc/html/rfc2195). Pour que cette méthode fonctionne, le mot de passe doit être stocké en clair.

- **`external`**

  [AUTH EXTERNAL](https://datatracker.ietf.org/doc/html/rfc4422) (1.11.6).

- **`none`**

  L'authentification n'est pas exigée.

Les méthodes d'authentification en texte clair (`AUTH PLAIN` et `AUTH LOGIN`) sont toujours activées, mais si les méthodes `plain` et `login` ne sont pas indiquées, `AUTH PLAIN` et `AUTH LOGIN` ne sont pas ajoutées automatiquement à [[12-directives/smtp-capabilities|smtp_capabilities]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

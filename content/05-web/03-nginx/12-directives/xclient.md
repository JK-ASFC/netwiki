---
title: "xclient"
description: "Directive nginx xclient (ngx_mail_proxy_module) — Active ou désactive la transmission de la commande XCLIENT avec les paramètres du client lors de la connexion au serveur SMTP d'arrière-plan. Avec XCLIENT, le MTA peut journaliser les informations du…"
tags: [nginx, directive, ngx_mail_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xclient on \| off;` |
| **Valeur par défaut** | `xclient on;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_proxy_module\|ngx_mail_proxy_module]] |

## Utilisation

Active ou désactive la transmission de la commande [XCLIENT](http://www.postfix.org/XCLIENT_README.html) avec les paramètres du client lors de la connexion au serveur SMTP d'arrière-plan.

Avec `XCLIENT`, le MTA peut journaliser les informations du client et appliquer diverses restrictions à partir de ces données.

Si `XCLIENT` est activé, nginx transmet les commandes suivantes lors de la connexion au serveur d'arrière-plan :

- `EHLO` avec le [[12-directives/server-name-mail-core|nom du serveur]]
- `XCLIENT`
- `EHLO` ou `HELO`, tel que transmis par le client

Si le nom [[12-directives/resolver-mail-core|trouvé]] à partir de l'adresse IP du client pointe vers la même adresse, il est transmis dans le paramètre `NAME` de la commande `XCLIENT`. Si le nom est introuvable, pointe vers une autre adresse ou si aucun [[12-directives/resolver-mail-core|résolveur]] n'est indiqué, `[UNAVAILABLE]` est transmis dans `NAME`. En cas d'erreur de résolution, la valeur `[TEMPUNAVAIL]` est utilisée.

Si `XCLIENT` est désactivé, nginx transmet lors de la connexion au serveur d'arrière-plan la commande `EHLO` avec le [[12-directives/server-name-mail-core|nom du serveur]] si le client a transmis `EHLO`, sinon `HELO` avec le nom du serveur.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

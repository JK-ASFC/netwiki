---
title: "uwsgi_ssl_conf_command"
description: "Directive nginx uwsgi_ssl_conf_command (ngx_http_uwsgi_module) — Définit des commandes de configuration OpenSSL quelconques à appliquer lors de l'établissement de la connexion avec le serveur uwsgi sécurisé. NOTE Cette directive est prise en charge avec OpenSSL…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_conf_command name value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.19.4 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Définit des [commandes](https://www.openssl.org/docs/man1.1.1/man3/SSL_CONF_cmd.html) de configuration OpenSSL quelconques à appliquer lors de l'établissement de la connexion avec le serveur uwsgi sécurisé.

> [!NOTE]
> Cette directive est prise en charge avec OpenSSL 1.0.2 ou plus récent.

Plusieurs directives `uwsgi_ssl_conf_command` peuvent être indiquées au même niveau. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `uwsgi_ssl_conf_command` n'est définie au niveau courant.

> [!NOTE]
> Configurer OpenSSL directement peut provoquer un comportement inattendu.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

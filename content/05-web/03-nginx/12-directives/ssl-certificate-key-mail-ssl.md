---
title: "ssl_certificate_key (ngx_mail_ssl_module)"
description: "Directive nginx ssl_certificate_key (ngx_mail_ssl_module) — Indique le fichier (file) contenant la clé secrète au format PEM pour le serveur. On peut indiquer engine:name:id à la place de file (1.7.9) pour charger la clé secrète d'identifiant id depuis le…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_certificate_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Indique le fichier (*file*) contenant la clé secrète au format PEM pour le serveur.

On peut indiquer `engine`:*name*:*id* à la place de *file* (1.7.9) pour charger la clé secrète d'identifiant *id* depuis le moteur OpenSSL *name*.

On peut indiquer `store`:*scheme*:*id* à la place de *file* (1.29.0) pour charger la clé secrète d'identifiant *id* via le schéma d'URI *scheme* enregistré par un fournisseur OpenSSL, par exemple [`pkcs11`](https://datatracker.ietf.org/doc/html/rfc7512).

On peut indiquer `data`:*key* à la place de *file* (1.15.10) pour charger la clé secrète sans fichier intermédiaire. Une mauvaise utilisation de cette syntaxe peut avoir des conséquences sur la sécurité, comme l'écriture de données de clé secrète dans le [[12-directives/error-log|journal d'erreurs]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

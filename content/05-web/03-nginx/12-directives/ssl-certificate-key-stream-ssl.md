---
title: "ssl_certificate_key (ngx_stream_ssl_module)"
description: "Directive nginx ssl_certificate_key (ngx_stream_ssl_module) — Indique le fichier (file) contenant la clé secrète au format PEM pour le serveur virtuel. On peut indiquer engine:name:id à la place de file pour charger la clé secrète d'identifiant id depuis le…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_certificate_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Indique le fichier (*file*) contenant la clé secrète au format PEM pour le serveur virtuel.

On peut indiquer `engine`:*name*:*id* à la place de *file* pour charger la clé secrète d'identifiant *id* depuis le moteur OpenSSL *name*.

On peut indiquer `store`:*scheme*:*id* à la place de *file* (1.29.0) pour charger la clé secrète d'identifiant *id* via le schéma d'URI *scheme* enregistré par un fournisseur OpenSSL, par exemple [`pkcs11`](https://datatracker.ietf.org/doc/html/rfc7512).

On peut indiquer `data`:*$variable* à la place de *file* (1.15.10) pour charger la clé secrète depuis une variable, sans fichier intermédiaire. Une mauvaise utilisation de cette syntaxe peut avoir des conséquences sur la sécurité, comme l'écriture de données de clé secrète dans le [[12-directives/error-log|journal d'erreurs]].

Depuis la version 1.15.9, le nom de fichier (*file*) peut contenir des variables avec OpenSSL 1.0.2 ou plus récent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

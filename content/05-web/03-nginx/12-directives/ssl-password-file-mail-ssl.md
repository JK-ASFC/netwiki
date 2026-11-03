---
title: "ssl_password_file (ngx_mail_ssl_module)"
description: "Directive nginx ssl_password_file (ngx_mail_ssl_module) — Indique un fichier (file) de phrases de passe pour les clés secrètes, une phrase par ligne. Les phrases sont essayées tour à tour au chargement de la clé. Exemple : nginx mail { ssl_password_file…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_password_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Apparue dans la version** | 1.7.3 |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Indique un fichier (*file*) de phrases de passe pour les [[12-directives/ssl-certificate-key-mail-ssl|clés secrètes]], une phrase par ligne. Les phrases sont essayées tour à tour au chargement de la clé.

Exemple :

```nginx
mail {
    ssl_password_file /etc/keys/global.pass;
    ...

    server {
        server_name mail1.example.com;
        ssl_certificate_key /etc/keys/first.key;
    }

    server {
        server_name mail2.example.com;

        # named pipe can also be used instead of a file
        ssl_password_file /etc/keys/fifo;
        ssl_certificate_key /etc/keys/second.key;
    }
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

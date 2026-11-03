---
title: "ssl_certificate (ngx_mail_ssl_module)"
description: "Directive nginx ssl_certificate (ngx_mail_ssl_module) — Indique le fichier (file) contenant le certificat au format PEM pour le serveur. Si des certificats intermédiaires doivent accompagner le certificat principal, ils se placent dans le même fichier,…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Indique le fichier (*file*) contenant le certificat au format PEM pour le serveur. Si des certificats intermédiaires doivent accompagner le certificat principal, ils se placent dans le même fichier, dans cet ordre : d'abord le certificat principal, puis les certificats intermédiaires. Une clé secrète au format PEM peut figurer dans le même fichier.

Depuis la version 1.11.0, cette directive peut être indiquée plusieurs fois pour charger des certificats de types différents, par exemple RSA et ECDSA :

```nginx
server {
    listen              993 ssl;

    ssl_certificate     example.com.rsa.crt;
    ssl_certificate_key example.com.rsa.key;

    ssl_certificate     example.com.ecdsa.crt;
    ssl_certificate_key example.com.ecdsa.key;

    ...
}
```

> [!NOTE]
> Seul OpenSSL 1.0.2 ou plus récent prend en charge des [[10-guides/02-http/configuring-https-servers|chaînes de certificats]] distinctes pour différents certificats. Avec les versions plus anciennes, une seule chaîne peut être utilisée.

On peut indiquer `data`:*certificate* à la place de *file* (1.15.10) pour charger le certificat sans fichier intermédiaire. Une mauvaise utilisation de cette syntaxe peut avoir des conséquences sur la sécurité, comme l'écriture de données de clé secrète dans le [[12-directives/error-log|journal d'erreurs]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ssl_certificate (ngx_http_ssl_module)"
description: "Directive nginx ssl_certificate (ngx_http_ssl_module) — Specifies a file with the certificate in the PEM format for the given virtual server. If intermediate certificates should be specified in addition to a primary certificate, they should be specified…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Specifies a *file* with the certificate in the PEM format for the given virtual server. If intermediate certificates should be specified in addition to a primary certificate, they should be specified in the same file in the following order: the primary certificate comes first, then the intermediate certificates. A secret key in the PEM format may be placed in the same file.

Since version 1.11.0, this directive can be specified multiple times to load certificates of different types, for example, RSA and ECDSA:

```nginx
server {
    listen              443 ssl;
    server_name         example.com;

    ssl_certificate     example.com.rsa.crt;
    ssl_certificate_key example.com.rsa.key;

    ssl_certificate     example.com.ecdsa.crt;
    ssl_certificate_key example.com.ecdsa.key;

    ...
}
```

> [!NOTE]
> Only OpenSSL 1.0.2 or higher supports separate [[10-guides/02-http/configuring-https-servers|certificate chains]] for different certificates. With older versions, only one certificate chain can be used.

Since version 1.15.9, variables can be used in the *file* name when using OpenSSL 1.0.2 or higher:

```nginx
ssl_certificate     $ssl_server_name.crt;
ssl_certificate_key $ssl_server_name.key;
```

Note that using variables implies that a certificate will be loaded for each SSL handshake, and this may have a negative impact on performance.

Since [[13-variables/ssl-server-name-http-ssl|$ssl_server_name]] is chosen by the client, loading certificates with such a file name should be filtered:

```nginx
map $ssl_server_name $name {
    hostnames;

    default        www.example.org;

    .example.org   www.example.org;
    .example.com   www.example.com;
}

server {
    listen              443 ssl;
    ssl_certificate     certs/$name.crt;
    ssl_certificate_key certs/$name.key;
}
```

The value `data`:*$variable* can be specified instead of the *file* (1.15.10), which loads a certificate from a variable without using intermediate files. Note that inappropriate use of this syntax may have its security implications, such as writing secret key data to [[12-directives/error-log|error log]].

It should be kept in mind that due to the SSL/TLS protocol limitations, for maximum interoperability with clients that do not use [SNI](http://en.wikipedia.org/wiki/Server_Name_Indication), virtual servers with different certificates should listen on [[10-guides/02-http/configuring-https-servers|different IP addresses]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

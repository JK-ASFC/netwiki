---
title: "ngx_mail_ssl_module"
description: "Module nginx ngx_mail_ssl_module — Le module ngx_mail_ssl_module fournit la prise en charge nécessaire pour que le mandataire de messagerie fonctionne avec le protocole SSL/TLS."
tags: [nginx, module, ngx_mail_ssl_module]
icon: puzzle
---

Le module `ngx_mail_ssl_module` fournit la prise en charge nécessaire pour que le mandataire de messagerie fonctionne avec le protocole SSL/TLS.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-mail_ssl_module`.

> [!NOTE]
> Ce module nécessite la bibliothèque [OpenSSL](http://www.openssl.org).

## Exemple de configuration

Pour réduire la charge du processeur, il est recommandé de

- régler le nombre de [[12-directives/worker-processes|processus de travail]] sur le nombre de processeurs,
- activer le cache de sessions partagé,
- désactiver le cache de sessions intégré,
- et éventuellement augmenter la [[12-directives/ssl-session-timeout-mail-ssl|durée de vie]] des sessions (5 minutes par défaut) :

```nginx
worker_processes auto;

mail {

    ...

    server {
        listen              993 ssl;

        ssl_protocols       TLSv1.2 TLSv1.3;
        ssl_ciphers         AES128-SHA:AES256-SHA:RC4-SHA:DES-CBC3-SHA:RC4-MD5;
        ssl_certificate     /usr/local/nginx/conf/cert.pem;
        ssl_certificate_key /usr/local/nginx/conf/cert.key;
        ssl_session_cache   shared:SSL:10m;
        ssl_session_timeout 10m;

        ...
    }
```

## Directives

- [[12-directives/ssl-mail-ssl|ssl]]
- [[12-directives/ssl-certificate-mail-ssl|ssl_certificate]]
- [[12-directives/ssl-certificate-compression-mail-ssl|ssl_certificate_compression]]
- [[12-directives/ssl-certificate-key-mail-ssl|ssl_certificate_key]]
- [[12-directives/ssl-ciphers-mail-ssl|ssl_ciphers]]
- [[12-directives/ssl-client-certificate-mail-ssl|ssl_client_certificate]]
- [[12-directives/ssl-conf-command-mail-ssl|ssl_conf_command]]
- [[12-directives/ssl-crl-mail-ssl|ssl_crl]]
- [[12-directives/ssl-dhparam-mail-ssl|ssl_dhparam]]
- [[12-directives/ssl-ecdh-curve-mail-ssl|ssl_ecdh_curve]]
- [[12-directives/ssl-password-file-mail-ssl|ssl_password_file]]
- [[12-directives/ssl-prefer-server-ciphers-mail-ssl|ssl_prefer_server_ciphers]]
- [[12-directives/ssl-protocols-mail-ssl|ssl_protocols]]
- [[12-directives/ssl-session-cache-mail-ssl|ssl_session_cache]]
- [[12-directives/ssl-session-ticket-key-mail-ssl|ssl_session_ticket_key]]
- [[12-directives/ssl-session-tickets-mail-ssl|ssl_session_tickets]]
- [[12-directives/ssl-session-timeout-mail-ssl|ssl_session_timeout]]
- [[12-directives/ssl-trusted-certificate-mail-ssl|ssl_trusted_certificate]]
- [[12-directives/ssl-verify-client-mail-ssl|ssl_verify_client]]
- [[12-directives/ssl-verify-depth-mail-ssl|ssl_verify_depth]]
- [[12-directives/starttls|starttls]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

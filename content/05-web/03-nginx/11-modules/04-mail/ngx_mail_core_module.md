---
title: "ngx_mail_core_module"
description: "Module nginx ngx_mail_core_module — This module is not built by default, it should be enabled with the --with-mail configuration parameter."
tags: [nginx, module, ngx_mail_core_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

This module is not built by default, it should be enabled with the `--with-mail` configuration parameter.

## Exemple de configuration

```nginx
worker_processes auto;

error_log /var/log/nginx/error.log info;

events {
    worker_connections  1024;
}

mail {
    server_name       mail.example.com;
    auth_http         localhost:9000/cgi-bin/nginxauth.cgi;

    imap_capabilities IMAP4rev1 UIDPLUS IDLE LITERAL+ QUOTA;

    pop3_auth         plain apop cram-md5;
    pop3_capabilities LAST TOP USER PIPELINING UIDL;

    smtp_auth         login plain cram-md5;
    smtp_capabilities "SIZE 10485760" ENHANCEDSTATUSCODES 8BITMIME DSN;
    xclient           off;

    server {
        listen   25;
        protocol smtp;
    }
    server {
        listen   110;
        protocol pop3;
        proxy_pass_error_message on;
    }
    server {
        listen   143;
        protocol imap;
    }
    server {
        listen   587;
        protocol smtp;
    }
}
```

## Directives

- [[12-directives/listen-mail-core|listen]]
- [[12-directives/mail|mail]]
- [[12-directives/max-errors|max_errors]]
- [[12-directives/protocol|protocol]]
- [[12-directives/resolver-mail-core|resolver]]
- [[12-directives/resolver-timeout-mail-core|resolver_timeout]]
- [[12-directives/server-mail-core|server]]
- [[12-directives/server-name-mail-core|server_name]]
- [[12-directives/timeout|timeout]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

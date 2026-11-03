---
title: "ngx_http_acme_module"
description: "Module nginx ngx_http_acme_module — Le module ngx_http_acme_module met en œuvre le protocole de gestion automatique des certificats (ACMEv2)."
tags: [nginx, module, ngx_http_acme_module]
icon: puzzle
---

Le module `ngx_http_acme_module` met en œuvre le protocole de gestion automatique des certificats ([ACMEv2](https://datatracker.ietf.org/doc/html/rfc8555)).

Le code source du module est disponible [ici](https://github.com/nginx/nginx-acme). Les instructions de téléchargement et d'installation sont disponibles [ici](https://github.com/nginx/nginx-acme/blob/main/README.md).

Le module est aussi disponible dans le paquet précompilé `nginx-module-acme` et, dans le cadre de notre [abonnement commercial](https://nginx.com/products/), dans le paquet `nginx-plus-module-acme` depuis la version 1.29.0.

## Exemple de configuration

```nginx
resolver 127.0.0.1:53;

acme_issuer example {
    uri         https://acme.example.com/directory;
    contact     admin@example.test;
    state_path  /var/cache/nginx/acme-example;
    accept_terms_of_service;
}

acme_shared_zone zone=ngx_acme_shared:1M;

server {
    listen 443 ssl;
    server_name  .example.test;

    acme_certificate example;

    ssl_certificate       $acme_certificate;
    ssl_certificate_key   $acme_certificate_key;

    # do not parse the certificate on each request
    ssl_certificate_cache max=2;
}

server {
    # listener on port 80 is required to process ACME HTTP-01 challenges
    listen 80;

    location / {
        return 404;
    }
}
```

## Directives

- [[12-directives/acme-issuer|acme_issuer]]
- [[12-directives/uri|uri]]
- [[12-directives/account-key|account_key]]
- [[12-directives/challenge|challenge]]
- [[12-directives/common-name-in-csr|common_name_in_csr]]
- [[12-directives/contact|contact]]
- [[12-directives/external-account-key|external_account_key]]
- [[12-directives/preferred-chain|preferred_chain]]
- [[12-directives/profile|profile]]
- [[12-directives/ssl-trusted-certificate-http-acme|ssl_trusted_certificate]]
- [[12-directives/ssl-verify-http-acme|ssl_verify]]
- [[12-directives/state-path-http-acme|state_path]]
- [[12-directives/accept-terms-of-service|accept_terms_of_service]]
- [[12-directives/acme-shared-zone|acme_shared_zone]]
- [[12-directives/acme-certificate|acme_certificate]]

## Variables intégrées

- [[13-variables/acme-certificate|$acme_certificate]]
- [[13-variables/acme-certificate-key|$acme_certificate_key]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

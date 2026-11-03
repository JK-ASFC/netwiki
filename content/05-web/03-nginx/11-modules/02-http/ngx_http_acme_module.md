---
title: "ngx_http_acme_module"
description: "Module nginx ngx_http_acme_module — The ngx_http_acme_module module implements the automatic certificate management (ACMEv2) protocol."
tags: [nginx, module, ngx_http_acme_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_acme_module` module implements the automatic certificate management ([ACMEv2](https://datatracker.ietf.org/doc/html/rfc8555)) protocol.

The source code of the module is available [here](https://github.com/nginx/nginx-acme). Download and install instructions are available [here](https://github.com/nginx/nginx-acme/blob/main/README.md).

The module is also available in a prebuilt `nginx-module-acme` package and in `nginx-plus-module-acme` package as part of our [abonnement commercial](https://nginx.com/products/) since 1.29.0.

## Example Configuration

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

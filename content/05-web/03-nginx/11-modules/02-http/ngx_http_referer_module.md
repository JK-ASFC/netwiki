---
title: "ngx_http_referer_module"
description: "Module nginx ngx_http_referer_module — The ngx_http_referer_module module is used to block access to a site for requests with invalid values in the Referer header field. It should be kept in mind that fabricating a request with an appropriate Referer field…"
tags: [nginx, module, ngx_http_referer_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_referer_module` module is used to block access to a site for requests with invalid values in the `Referer` header field. It should be kept in mind that fabricating a request with an appropriate `Referer` field value is quite easy, and so the intended purpose of this module is not to block such requests thoroughly but to block the mass flow of requests sent by regular browsers. It should also be taken into consideration that regular browsers may not send the `Referer` field even for valid requests.

## Exemple de configuration

```nginx
valid_referers none blocked server_names
               *.example.com example.* www.example.org/galleries/
               ~\.google\.;

if ($invalid_referer) {
    return 403;
}
```

## Directives

- [[12-directives/referer-hash-bucket-size|referer_hash_bucket_size]]
- [[12-directives/referer-hash-max-size|referer_hash_max_size]]
- [[12-directives/valid-referers|valid_referers]]

## Variables intégrées

- [[13-variables/invalid-referer|$invalid_referer]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

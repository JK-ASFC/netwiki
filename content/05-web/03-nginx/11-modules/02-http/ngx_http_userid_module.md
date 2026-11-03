---
title: "ngx_http_userid_module"
description: "Module nginx ngx_http_userid_module — The ngx_http_userid_module module sets cookies suitable for client identification. Received and set cookies can be logged using the embedded variables $uid_got and $uid_set. This module is compatible with the mod_uid…"
tags: [nginx, module, ngx_http_userid_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_userid_module` module sets cookies suitable for client identification. Received and set cookies can be logged using the embedded variables [[13-variables/uid-got|$uid_got]] and [[13-variables/uid-set|$uid_set]]. This module is compatible with the [mod\_uid](http://www.lexa.ru/programs/mod-uid-eng.html) module for Apache.

## Exemple de configuration

```nginx
userid         on;
userid_name    uid;
userid_domain  example.com;
userid_path    /;
userid_expires 365d;
userid_p3p     'policyref="/w3c/p3p.xml", CP="CUR ADM OUR NOR STA NID"';
```

## Directives

- [[12-directives/userid|userid]]
- [[12-directives/userid-domain|userid_domain]]
- [[12-directives/userid-expires|userid_expires]]
- [[12-directives/userid-flags|userid_flags]]
- [[12-directives/userid-mark|userid_mark]]
- [[12-directives/userid-name|userid_name]]
- [[12-directives/userid-p3p|userid_p3p]]
- [[12-directives/userid-path|userid_path]]
- [[12-directives/userid-service|userid_service]]

## Variables intégrées

- [[13-variables/uid-got|$uid_got]]
- [[13-variables/uid-reset|$uid_reset]]
- [[13-variables/uid-set|$uid_set]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

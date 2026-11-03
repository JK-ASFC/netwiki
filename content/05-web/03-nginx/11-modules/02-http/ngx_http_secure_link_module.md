---
title: "ngx_http_secure_link_module"
description: "Module nginx ngx_http_secure_link_module — The ngx_http_secure_link_module module (0.7.18) is used to check authenticity of requested links, protect resources from unauthorized access, and limit link lifetime."
tags: [nginx, module, ngx_http_secure_link_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_secure_link_module` module (0.7.18) is used to check authenticity of requested links, protect resources from unauthorized access, and limit link lifetime.

The authenticity of a requested link is verified by comparing the checksum value passed in a request with the value computed for the request. If a link has a limited lifetime and the time has expired, the link is considered outdated. The status of these checks is made available in the `$secure_link` variable.

The module provides two alternative operation modes. The first mode is enabled by the [[12-directives/secure-link-secret|secure_link_secret]] directive and is used to check authenticity of requested links as well as protect resources from unauthorized access. The second mode (0.8.50) is enabled by the [[12-directives/secure-link|secure_link]] and [[12-directives/secure-link-md5|secure_link_md5]] directives and is also used to limit lifetime of links.

This module is not built by default, it should be enabled with the `--with-http_secure_link_module` configuration parameter.

## Directives

- [[12-directives/secure-link|secure_link]]
- [[12-directives/secure-link-md5|secure_link_md5]]
- [[12-directives/secure-link-secret|secure_link_secret]]

## Variables intégrées

- [[13-variables/secure-link|$secure_link]]
- [[13-variables/secure-link-expires|$secure_link_expires]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

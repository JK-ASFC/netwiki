---
title: "ngx_mgmt_module"
description: "Module nginx ngx_mgmt_module — The ngx_mgmt_module module enables NGINX Plus license verification and usage reporting. This is mandatory for each NGINX Plus instance since 1.27.2 ( NGINX Plus R33)."
tags: [nginx, module, ngx_mgmt_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_mgmt_module` module enables NGINX Plus license verification and usage reporting. This is mandatory for each NGINX Plus instance since 1.27.2 ( [NGINX Plus R33](https://docs.nginx.com/nginx/releases/#r33)).

A JWT license file named `license.jwt` should be located at `/etc/nginx/` for Linux or `/usr/local/etc/nginx/` for FreeBSD or at the path specified by the [[12-directives/license-token|license_token]] directive. The license file is available from [MyF5](https://my.f5.com).

Usage report is sent directly or via [[12-directives/proxy|proxy]] to F5 licensing endpoint [[12-directives/usage-report|every hour]] using the [[12-directives/ssl-verify-mgmt|secure]] connection. Optionally, in network-restricted environments reporting can be [[12-directives/usage-report|configured]] to [F5 NGINX Instance Manager](https://docs.nginx.com/nginx-management-suite/about/) from which the report can be sent to F5 licensing endpoint.

By default, if the [[12-directives/enforce-initial-report|initial usage report]] is not received by F5 licensing endpoint, nginx will stop processing traffic.

Automatic license renewal is supported since 1.29.0 ([NGINX Plus R35](https://docs.nginx.com/nginx/releases/#r35)) for instances that report directly to the F5 licensing endpoint. On renewal, NGINX downloads the updated JWT from F5 licensing endpoint and applies it without configuration [[10-guides/01-introduction/switches|reload]]. The updated license is stored in the [[12-directives/state-path-mgmt|state_path]] directory.

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Example Configuration

```nginx
mgmt {
    # in case if custom path is required
    license_token custom/file/path/license.jwt;

    # in case of reporting to NGINX Instance Manager
    usage_report endpoint=NIM_FQDN;
}
```

## Directives

- [[12-directives/mgmt|mgmt]]
- [[12-directives/enforce-initial-report|enforce_initial_report]]
- [[12-directives/license-token|license_token]]
- [[12-directives/license-pending-token|license_pending_token]]
- [[12-directives/proxy|proxy]]
- [[12-directives/proxy-username|proxy_username]]
- [[12-directives/proxy-password|proxy_password]]
- [[12-directives/resolver-mgmt|resolver]]
- [[12-directives/ssl-crl-mgmt|ssl_crl]]
- [[12-directives/ssl-trusted-certificate-mgmt|ssl_trusted_certificate]]
- [[12-directives/ssl-verify-mgmt|ssl_verify]]
- [[12-directives/state-path-mgmt|state_path]]
- [[12-directives/usage-report|usage_report]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ngx_http_proxy_protocol_vendor_module"
description: "Module nginx ngx_http_proxy_protocol_vendor_module — The ngx_http_proxy_protocol_vendor_module module (1.23.3) allows obtaining additional information about a connection in cloud platforms from application-specific TLVs of the PROXY protocol header."
tags: [nginx, module, ngx_http_proxy_protocol_vendor_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_proxy_protocol_vendor_module` module (1.23.3) allows obtaining additional information about a connection in cloud platforms from application-specific TLVs of the [PROXY protocol](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) header.

Supported cloud platforms:

- Amazon Web Services
- Google Cloud Platform
- Microsoft Azure

Le protocole PROXY doit au préalable être activé avec le paramètre `proxy_protocol` de la directive [[12-directives/listen-http-core|listen]].

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
proxy_set_header X-Conn-ID $proxy_protocol_tlv_gcp_conn_id;

server {
    listen 80   proxy_protocol;
    listen 443  ssl proxy_protocol;
    ...
}
```

## Variables intégrées

- [[13-variables/proxy-protocol-tlv-aws-vpce-id-http-proxy-protocol-vendor|$proxy_protocol_tlv_aws_vpce_id]]
- [[13-variables/proxy-protocol-tlv-azure-pel-id-http-proxy-protocol-vendor|$proxy_protocol_tlv_azure_pel_id]]
- [[13-variables/proxy-protocol-tlv-gcp-conn-id-http-proxy-protocol-vendor|$proxy_protocol_tlv_gcp_conn_id]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "ngx_stream_proxy_protocol_vendor_module"
description: "Module nginx ngx_stream_proxy_protocol_vendor_module — The ngx_stream_proxy_protocol_vendor_module module (1.23.3) allows obtaining additional information about a connection in cloud platforms from application-specific TLVs of the PROXY protocol header."
tags: [nginx, module, ngx_stream_proxy_protocol_vendor_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_proxy_protocol_vendor_module` module (1.23.3) allows obtaining additional information about a connection in cloud platforms from application-specific TLVs of the [PROXY protocol](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) header.

Supported cloud platforms:

- Amazon Web Services
- Google Cloud Platform
- Microsoft Azure

The PROXY protocol must be previously enabled by setting the `proxy_protocol` parameter in the [[12-directives/listen-stream-core|listen]] directive.

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
server {
    listen 12345 proxy_protocol;
    return $proxy_protocol_tlv_gcp_conn_id;
}
```

## Variables intégrées

- [[13-variables/proxy-protocol-tlv-aws-vpce-id-stream-proxy-protocol-vendor|$proxy_protocol_tlv_aws_vpce_id]]
- [[13-variables/proxy-protocol-tlv-azure-pel-id-stream-proxy-protocol-vendor|$proxy_protocol_tlv_azure_pel_id]]
- [[13-variables/proxy-protocol-tlv-gcp-conn-id-stream-proxy-protocol-vendor|$proxy_protocol_tlv_gcp_conn_id]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

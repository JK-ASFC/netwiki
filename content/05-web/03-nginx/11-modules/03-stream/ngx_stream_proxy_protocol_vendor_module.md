---
title: "ngx_stream_proxy_protocol_vendor_module"
description: "Module nginx ngx_stream_proxy_protocol_vendor_module — Le module ngx_stream_proxy_protocol_vendor_module (1.23.3) permet d'obtenir des informations supplémentaires sur une connexion dans les plates-formes cloud, à partir des TLV propres à chaque application de l'en-tête du…"
tags: [nginx, module, ngx_stream_proxy_protocol_vendor_module]
icon: puzzle
---

Le module `ngx_stream_proxy_protocol_vendor_module` (1.23.3) permet d'obtenir des informations supplémentaires sur une connexion dans les plates-formes cloud, à partir des TLV propres à chaque application de l'en-tête du [protocole PROXY](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

Plates-formes cloud prises en charge :

- Amazon Web Services
- Google Cloud Platform
- Microsoft Azure

Le protocole PROXY doit au préalable être activé avec le paramètre `proxy_protocol` de la directive [[12-directives/listen-stream-core|listen]].

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

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

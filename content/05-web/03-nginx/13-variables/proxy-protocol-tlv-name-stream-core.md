---
title: "$proxy_protocol_tlv_name (ngx_stream_core_module)"
description: "Variable nginx $proxy_protocol_tlv_name (ngx_stream_core_module) — TLV from the PROXY Protocol header (1.23.2). The name can be a TLV type name or its numeric value. In the latter case, the value is hexadecimal and should be prefixed with 0x: nginx…"
tags: [nginx, variable, ngx_stream_core_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$proxy_protocol_tlv_name` |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

TLV from the PROXY Protocol header (1.23.2). The `name` can be a TLV type name or its numeric value. In the latter case, the value is hexadecimal and should be prefixed with `0x`:

```nginx
$proxy_protocol_tlv_alpn
$proxy_protocol_tlv_0x01
```

SSL TLVs can also be accessed by TLV type name or its numeric value, both prefixed by `ssl_`:

```nginx
$proxy_protocol_tlv_ssl_version
$proxy_protocol_tlv_ssl_0x21
```

The following TLV type names are supported:

- `alpn` (`0x01`) — upper layer protocol used over the connection
- `authority` (`0x02`) — host name value passed by the client
- `unique_id` (`0x05`) — unique connection id
- `netns` (`0x30`) — name of the namespace
- `ssl` (`0x20`) — binary SSL TLV structure

The following SSL TLV type names are supported:

- `ssl_version` (`0x21`) — SSL version used in client connection
- `ssl_cn` (`0x22`) — SSL certificate Common Name
- `ssl_cipher` (`0x23`) — name of the used cipher
- `ssl_sig_alg` (`0x24`) — algorithm used to sign the certificate
- `ssl_key_alg` (`0x25`) — public-key algorithm

Also, the following special SSL TLV type name is supported:

- `ssl_verify` — client SSL certificate verification result, zero if the client presented a certificate and it was successfully verified, and non-zero otherwise

The PROXY protocol must be previously enabled by setting the `proxy_protocol` parameter in the [[12-directives/listen-stream-core|listen]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

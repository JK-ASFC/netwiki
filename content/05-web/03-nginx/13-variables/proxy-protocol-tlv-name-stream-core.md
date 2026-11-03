---
title: "$proxy_protocol_tlv_name (ngx_stream_core_module)"
description: "Variable nginx $proxy_protocol_tlv_name (ngx_stream_core_module) — TLV de l'en-tête du protocole PROXY (1.23.2). name peut être le nom du type de TLV ou sa valeur numérique ; dans ce dernier cas, la valeur est hexadécimale et doit être précédée de 0x : nginx…"
tags: [nginx, variable, ngx_stream_core_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$proxy_protocol_tlv_name` |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

TLV de l'en-tête du protocole PROXY (1.23.2). `name` peut être le nom du type de TLV ou sa valeur numérique ; dans ce dernier cas, la valeur est hexadécimale et doit être précédée de `0x` :

```nginx
$proxy_protocol_tlv_alpn
$proxy_protocol_tlv_0x01
```

Les TLV SSL sont aussi accessibles par le nom de leur type ou par leur valeur numérique, tous deux précédés de `ssl_` :

```nginx
$proxy_protocol_tlv_ssl_version
$proxy_protocol_tlv_ssl_0x21
```

Les noms de types de TLV suivants sont pris en charge :

- `alpn` (`0x01`) : protocole de couche supérieure utilisé sur la connexion
- `authority` (`0x02`) : nom d'hôte transmis par le client
- `unique_id` (`0x05`) : identifiant unique de la connexion
- `netns` (`0x30`) : nom de l'espace de noms
- `ssl` (`0x20`) : structure TLV SSL binaire

Les noms de types de TLV SSL suivants sont pris en charge :

- `ssl_version` (`0x21`) : version SSL utilisée par la connexion du client
- `ssl_cn` (`0x22`) : nom commun (Common Name) du certificat SSL
- `ssl_cipher` (`0x23`) : nom de la suite de chiffrement utilisée
- `ssl_sig_alg` (`0x24`) : algorithme utilisé pour signer le certificat
- `ssl_key_alg` (`0x25`) : algorithme de clé publique

Le nom de type de TLV SSL spécial suivant est aussi pris en charge :

- `ssl_verify` — client SSL certificate verification result, zero if the client presented a certificate and it was successfully verified, and non-zero otherwise

The PROXY protocol must be previously enabled by setting the `proxy_protocol` parameter in the [[12-directives/listen-stream-core|listen]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

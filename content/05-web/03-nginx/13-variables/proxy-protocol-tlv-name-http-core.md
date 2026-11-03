---
title: "$proxy_protocol_tlv_name (ngx_http_core_module)"
description: "Variable nginx $proxy_protocol_tlv_name (ngx_http_core_module) — TLV de l'en-tête du protocole PROXY (1.23.2). name peut être le nom du type de TLV ou sa valeur numérique ; dans ce dernier cas, la valeur est hexadécimale et doit être précédée de 0x : nginx…"
tags: [nginx, variable, ngx_http_core_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$proxy_protocol_tlv_name` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

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

- `ssl_verify` : résultat de la vérification du certificat SSL du client ; `0` si le client a présenté un certificat vérifié avec succès, une valeur non nulle sinon.

Le protocole PROXY doit au préalable être activé avec le paramètre `proxy_protocol` de la directive [[12-directives/listen-http-core|listen]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

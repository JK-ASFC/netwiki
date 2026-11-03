---
title: "SSLProtocol"
description: "Directive Apache SSLProtocol (mod_ssl) — Indique les versions du protocole SSL/TLS disponibles. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Indique les versions du protocole SSL/TLS disponibles |
| **Syntaxe** | `SSLProtocol [+\|-]protocole ...` |
| **Valeur par défaut** | `SSLProtocol all -SSLv3 (jusqu'à la version 2.4.16 : all)` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive permet de définir quelles versions du protocole SSL/TLS seront acceptées lors de l'initialisation d'une nouvelle connexion.

Les *protocole*s disponibles sont les suivants (sensibles à la casse) :

- `SSLv3`

  Il s'agit du protocole Secure Sockets Layer (SSL) version 3.0 de Netscape Corporation. C'est le successeur de SSLv2 et le prédécesseur de TLSv1, mais est considéré comme obsolète dans la [RFC 7568](https://www.rfc-editor.org/rfc/rfc7568).
- `TLSv1`

  Il s'agit du protocole Transport Layer Security (TLS) version 1.0. C'est le successeur de SSLv3, et il est défini dans la [RFC 2246](https://www.rfc-editor.org/rfc/rfc2246). Il est supporté par la plupart des clients.
- `TLSv1.1` (à partir de la version 1.0.1 d'OpenSSL)

  Une révision du protocole TLS 1.0 définie dans la [RFC 4346](https://www.rfc-editor.org/rfc/rfc4346).
- `TLSv1.2` (à partir de la version 1.0.1 d'OpenSSL)

  Une révision du protocole TLS 1.1 définie dans la [RFC 5246](https://www.rfc-editor.org/rfc/rfc5246).
- `TLSv1.3` (à partir de la version 1.1.1 d'OpenSSL)

  Une nouvelle version du protocole TLS définie dans la [RFC 8446](https://www.rfc-editor.org/rfc/rfc8446).
- `all`

  C'est un raccourci pour \`\``+SSLv3 +TLSv1`'' ou - à partir de la version 1.0.1 d'OpenSSL - \`\``+SSLv3 +TLSv1 +TLSv1.1 +TLSv1.2 +TLSv1.3`'' (sauf si OpenSSL a été compilé avec l'option \`\`no-ssl3'', auquel cas `all` n'inclura pas `+SSLv3`).

**Exemple**

```apache
SSLProtocol TLSv1
```

> [!NOTE]
> **La directive `SSLProtocol` et les serveurs virtuels basés sur le nom**
>
> Avant OpenSSL 1.1.1, et même si l'indication du nom de serveur (Server Name Indication ou SNI) permettait de déterminer le serveur virtuel cible assez tôt au cours de la négociation TLS, il était impossible de changer de version de protocole TLS à ce point, si bien que le `SSLProtocol` négocié se basait toujours sur celui du *serveur virtuel de base* (le premier serveur virtuel déclaré avec le couple `IP:port` de la connexion).
>
> A partir de la version 2.4.42, si le serveur HTTP Apache est compilé avec une version 1.1.1. ou supérieure d'OpenSSL, et si le client fournit la SNI dans la négociation TLS, le `SSLProtocol` de chaque serveur virtuel (basé sur le nom) pourra être pris en compte et le sera.
>
> A des fins de compatibilité avec les versions précédentes, si un serveur virtuel basé sur le nom n'a aucune directive `SSLProtocol` définie, c'est le protocole du serveur virtuel de base qui s'appliquera, **à moins** qu'une directive `SSLProtocol` ne soit configurée au niveau global, auquel cas c'est le protocole défini par cette directive qui s'appliquera (ce dernier cas relève cependant plus d'un comportement logique que d'un souci de compatibilité).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

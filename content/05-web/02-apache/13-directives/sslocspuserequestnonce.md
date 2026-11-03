---
title: "SSLOCSPUseRequestNonce"
description: "Directive Apache SSLOCSPUseRequestNonce (mod_ssl) — Use a nonce within OCSP queries. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

> [!NOTE]
> Cette page n’a pas de traduction française officielle : le texte original en anglais est reproduit tel quel.

| Propriété | Valeur |
| --- | --- |
| **Description** | Use a nonce within OCSP queries |
| **Syntaxe** | `SSLOCSPUseRequestNonce on\|off` |
| **Valeur par défaut** | `SSLOCSPUseRequestNonce on` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Available in httpd 2.4.10 and later |

## Utilisation

This option determines whether queries to OCSP responders should contain a nonce or not. By default, a query nonce is always used and checked against the response's one. When the responder does not use nonces (e.g. Microsoft OCSP Responder), this option should be turned `off`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (texte original en anglais, pas de traduction officielle), © Apache Software Foundation, licence Apache 2.0.*

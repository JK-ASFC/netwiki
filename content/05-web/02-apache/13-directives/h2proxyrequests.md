---
title: "H2ProxyRequests"
description: "Directive Apache H2ProxyRequests (mod_http2) — Active/Désactive les requêtes sous mandat direct via HTTP/2. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active/Désactive les requêtes sous mandat direct via HTTP/2 |
| **Syntaxe** | `H2ProxyRequests on\|off` |
| **Valeur par défaut** | `H2ProxyRequests off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.58 du serveur HTTP Apache |

## Utilisation

La directive `H2ProxyRequests` permet d'activer ou de désactiver la gestion des requêtes HTTP/2 dans un contexte de mandat direct.

Similaire à [[13-directives/proxyrequests|ProxyRequests]], cette directive déclenche le traitement nécessaire des requêtes lorsque HTTP/2 est activé dans un contexte de mandat direct.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

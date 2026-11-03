---
title: "SSLOCSPNoverify"
description: "Directive Apache SSLOCSPNoverify (mod_ssl) — Evite la vérification des certificats des répondeurs OCSP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Evite la vérification des certificats des répondeurs OCSP |
| **Syntaxe** | `SSLOCSPNoverify on\|off` |
| **Valeur par défaut** | `SSLOCSPNoverify off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible à partir de la version 2.4.26 du serveur HTTP Apache, sous réserve d'utiliser une version 0.9.7 ou supérieure d'OpenSSL |

## Utilisation

Cette directive permet d'éviter la vérification des certificats des répondeurs OCSP, ce qui peut s'avérer utile lorsqu'on teste un serveur OCSP.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

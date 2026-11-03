---
title: "SSLProxyCipherSuite"
description: "Directive Apache SSLProxyCipherSuite (mod_ssl) — Algorithmes de chiffrement disponibles pour la négociation lors de l'initialisation d'une connexion SSL de mandataire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Algorithmes de chiffrement disponibles pour la négociation lors de l'initialisation d'une connexion SSL de mandataire |
| **Syntaxe** | `SSLProxyCipherSuite [protocol] cipher-spec` |
| **Valeur par défaut** | `SSLProxyCipherSuite ALL:!ADH:RC4+RSA:+HIGH:+MEDIUM:+LOW:+EXP` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive est équivalente à la directive [[13-directives/sslciphersuite|SSLCipherSuite]], mais s'applique à une connexion de mandataire. Veuillez vous reporter à la directive [[13-directives/sslciphersuite|SSLCipherSuite]] pour plus d'informations.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

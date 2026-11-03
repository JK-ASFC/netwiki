---
title: "NWSSLUpgradeable"
description: "Directive Apache NWSSLUpgradeable (mod_nw_ssl) — Permet de promouvoir une connexion non SSL au statut de connexion SSL à la demande. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_nw_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet de promouvoir une connexion non SSL au statut de connexion SSL à la demande |
| **Syntaxe** | `NWSSLUpgradeable [adresse-IP:]num-port` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_nw_ssl\|mod_nw_ssl]] |

## Utilisation

Cette directive permet de promouvoir une connexion établie sur l'adresse IP et/ou le port spécifiés au statut de connexion SSL à la demande du client. L'adresse et/ou le port doivent avoir été définis au préalable par une directive [[13-directives/listen|Listen]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

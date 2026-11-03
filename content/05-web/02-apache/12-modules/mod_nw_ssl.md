---
title: "mod_nw_ssl"
description: "Module Apache mod_nw_ssl — Active le chiffrement SSL pour Netware. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_nw_ssl]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active le chiffrement SSL pour Netware |
| **Statut** | Base |
| **Identificateur** | `nwssl_module` |
| **Fichier source** | `mod_nw_ssl.c` |
| **Compatibilité** | NetWare seulement |

## Sommaire

Ce module active le chiffrement SSL sur un port spécifique. Il s'appuie sur la fonctionnalité de chiffrement SSL intégrée au système d'exploitation Netware.

## Directives

- [[13-directives/securelisten|SecureListen]]
- [[13-directives/nwssltrustedcerts|NWSSLTrustedCerts]]
- [[13-directives/nwsslupgradeable|NWSSLUpgradeable]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

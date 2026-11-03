---
title: "mod_ident"
description: "Module Apache mod_ident — Recherche d'identité conformément à la RFC 1413. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_ident]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Recherche d'identité conformément à la RFC 1413 |
| **Statut** | Extension |
| **Identificateur** | `ident_module` |
| **Fichier source** | `mod_ident.c` |
| **Compatibilité** | Disponible depuis la version 2.2 d'Apache |

## Sommaire

Ce module interroge un démon compatible [RFC 1413](https://www.rfc-editor.org/rfc/rfc1413) sur un serveur distant afin de déterminer le propriétaire d'une connexion.

## Directives

- [[13-directives/identitycheck|IdentityCheck]]
- [[13-directives/identitychecktimeout|IdentityCheckTimeout]]

## Voir aussi

- [[12-modules/mod_log_config|mod_log_config]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

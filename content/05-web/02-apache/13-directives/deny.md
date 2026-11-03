---
title: "Deny"
description: "Directive Apache Deny (mod_access_compat) — Définit quels hôtes ne sont pas autorisés à accéder au serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_access_compat]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit quels hôtes ne sont pas autorisés à accéder au serveur |
| **Syntaxe** | `Deny from all\|hôte\|env=[!]variable d'environnement [hôte\|env=[!]variable d'environnement] ...` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | Limit |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_access_compat\|mod_access_compat]] |

## Utilisation

Cette directive permet de restreindre l'accès au serveur en fonction du nom d'hôte, de l'adresse IP ou de variables d'environnement. Les arguments de la directive `Deny` sont identiques aux arguments de la directive [[13-directives/allow|Allow]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

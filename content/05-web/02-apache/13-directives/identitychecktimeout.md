---
title: "IdentityCheckTimeout"
description: "Directive Apache IdentityCheckTimeout (mod_ident) — Détermine le délai d'attente pour les requêtes ident. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ident]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine le délai d'attente pour les requêtes ident |
| **Syntaxe** | `IdentityCheckTimeout secondes` |
| **Valeur par défaut** | `IdentityCheckTimeout 30` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ident\|mod_ident]] |

## Utilisation

Cette directive permet de spécifier le délai d'attente d'une requête ident. Une valeur par défaut de 30 secondes est recommandée par la [RFC 1413](https://www.rfc-editor.org/rfc/rfc1413), principalement pour prévenir les problèmes qui pourraient être induits par la charge du réseau. Vous pouvez cependant ajuster la valeur de ce délai en fonction du débit de votre réseau local.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

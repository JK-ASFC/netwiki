---
title: "AuthnCacheSOCache"
description: "Directive Apache AuthnCacheSOCache (mod_authn_socache) — Sélectionne le fournisseur socache d'arrière-plan à utiliser. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_socache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Sélectionne le fournisseur socache d'arrière-plan à utiliser |
| **Syntaxe** | `AuthnCacheSOCache nom-fournisseur[:arguments-fournisseur]` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authn_socache\|mod_authn_socache]] |
| **Compatibilité** | Les arguments optionnels du fournisseur sont disponibles à partir de la version 2.4.7 du serveur HTTP Apache |

## Utilisation

Cette définition s'applique à l'ensemble du serveur et permet de sélectionner un fournisseur pour le [[11-guides/01-generalites/le-cache-des-objets-partages-du-serveur-http-apache|cache d'objets partagés]], ainsi que des arguments éventuels pour ce fournisseur. Les fournisseurs disponibles sont, entre autres, "dbm", "dc", "memcache", ou "shmcb", chacun d'entre eux nécessitant le chargement du module approprié. Si elle est absente, c'est la valeur par défaut pour votre plate-forme qui sera utilisée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

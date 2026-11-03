---
title: "SSLFIPS"
description: "Directive Apache SSLFIPS (mod_ssl) — Coimmutateur du mode SSL FIPS. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Coimmutateur du mode SSL FIPS |
| **Syntaxe** | `SSLFIPS on\|off` |
| **Valeur par défaut** | `SSLFIPS off` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive permet d'activer/désactiver l'utilisation du drapeau FIPS\_mode de la bibliothèque SSL. Elle doit être définie dans le contexte du serveur principal, et n'accepte pas les configurations sources de conflits (SSLFIPS on suivi de SSLFIPS off par exemple). Le mode s'applique à toutes les opérations de la bibliothèque SSL.

Si httpd a été compilé avec une bibliothèque SSL qui ne supporte pas le drapeau FIPS\_mode, la directive `SSLFIPS on` échouera. Reportez-vous au document sur la politique de sécurité FIPS 140-2 de la bibliothèque du fournisseur SSL, pour les prérequis spécifiques nécessaires à l'utilisation de mod\_ssl selon un mode d'opération approuvé par FIPS 140-2 ; notez que mod\_ssl en lui-même n'est pas validé, mais peut être décrit comme utilisant un module de chiffrement validé par FIPS 140-2, lorsque tous les composants sont assemblés et mis en oeuvre selon les recommandations de la politique de sécurité applicable.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

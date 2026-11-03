---
title: "SSLOCSPDefaultResponder"
description: "Directive Apache SSLOCSPDefaultResponder (mod_ssl) — Définit l'URI du répondeur par défaut pour la validation OCSP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit l'URI du répondeur par défaut pour la validation OCSP |
| **Syntaxe** | `SSLOCSPDefaultResponder uri` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive permet de définir le répondeur OCSP par défaut. Si la directive [[13-directives/sslocspoverrideresponder|SSLOCSPOverrideResponder]] n'est pas activée, l'URI spécifié ne sera utilisé que si aucun URI de répondeur n'est spécifié dans le certificat en cours de vérification.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

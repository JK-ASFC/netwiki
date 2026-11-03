---
title: "SSLOCSPOverrideResponder"
description: "Directive Apache SSLOCSPOverrideResponder (mod_ssl) — Force l'utilisation de l'URI du répondeur par défaut pour la validation OCSP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Force l'utilisation de l'URI du répondeur par défaut pour la validation OCSP |
| **Syntaxe** | `SSLOCSPOverrideResponder on\|off` |
| **Valeur par défaut** | `SSLOCSPOverrideResponder off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Force l'utilisation, au cours d'une validation OCSP de certificat, du répondeur OCSP par défaut spécifié dans la configuration, que le certificat en cours de vérification fasse mention d'un répondeur OCSP ou non.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

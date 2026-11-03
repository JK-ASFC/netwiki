---
title: "SSLOCSPProxyURL"
description: "Directive Apache SSLOCSPProxyURL (mod_ssl) — Adresse de mandataire à utiliser pour les requêtes OCSP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Adresse de mandataire à utiliser pour les requêtes OCSP |
| **Syntaxe** | `SSLOCSPProxyURL url` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible à partir de la version 2.4.19 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir l'URL d'un mandataire HTTP qui devra être utilisé pour toutes les requêtes vers un répondeur OCSP.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

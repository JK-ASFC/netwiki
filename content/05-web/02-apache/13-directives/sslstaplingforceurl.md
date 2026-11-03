---
title: "SSLStaplingForceURL"
description: "Directive Apache SSLStaplingForceURL (mod_ssl) — Remplace l'URI du serveur OCSP spécifié dans l'extension AIA du certificat. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Remplace l'URI du serveur OCSP spécifié dans l'extension AIA du certificat |
| **Syntaxe** | `SSLStaplingForceURL uri` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible si on utilise OpenSSL version 0.9.8h ou supérieure |

## Utilisation

Cette directive permet de remplacer l'URI du serveur OCSP extraite de l'extension authorityInfoAccess (AIA) du certificat. Elle peut s'avérer utile lorsqu'on passe par un mandataire

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

---
title: "SSLStaplingReturnResponderErrors"
description: "Directive Apache SSLStaplingReturnResponderErrors (mod_ssl) — Transmet au client les erreurs survenues lors des requêtes OCSP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Transmet au client les erreurs survenues lors des requêtes OCSP |
| **Syntaxe** | `SSLStaplingReturnResponderErrors on\|off` |
| **Valeur par défaut** | `SSLStaplingReturnResponderErrors on` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible si on utilise OpenSSL version 0.9.8h ou supérieure |

## Utilisation

Lorsque cette directive est activée, mod\_ssl va transmettre au client les réponses concernant les requêtes OCSP échouées (comme les réponses avec un statut général autre que "successful", les réponses avec un statut de certificat autre que "good", les réponses arrivées à expiration, etc...). Lorsqu'elle est à `off`, seules les réponses avec un statut de certificat égal à "good" ou "revoked" seront incluses dans la négociation TLS. Les réponses avec un statut "revoked" sont toujours incluses quelle que soit cette définition, car supprimer une révocation connue constituerait un risque de sécurité.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

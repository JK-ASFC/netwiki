---
title: "SSLStaplingFakeTryLater"
description: "Directive Apache SSLStaplingFakeTryLater (mod_ssl) — Génère une réponse \"tryLater\" pour les requêtes OCSP échouées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Génère une réponse "tryLater" pour les requêtes OCSP échouées |
| **Syntaxe** | `SSLStaplingFakeTryLater on\|off` |
| **Valeur par défaut** | `SSLStaplingFakeTryLater on` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible si on utilise OpenSSL version 0.9.8h ou supérieure |

## Utilisation

Lorsque cette directive est activée, et si une requête vers un serveur OCSP à des fins d'inclusion dans une négociation TLS échoue, mod\_ssl va générer une réponse "tryLater" pour le client ([[13-directives/sslstaplingreturnrespondererrors|SSLStaplingReturnResponderErrors]] doit être activée).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

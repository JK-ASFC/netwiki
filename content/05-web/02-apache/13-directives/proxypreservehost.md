---
title: "ProxyPreserveHost"
description: "Directive Apache ProxyPreserveHost (mod_proxy) — Utilise l'en-tête de requête entrante Host pour la requête du mandataire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Utilise l'en-tête de requête entrante Host pour la requête du mandataire |
| **Syntaxe** | `ProxyPreserveHost On\|Off` |
| **Valeur par défaut** | `ProxyPreserveHost Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Utilisable dans un contexte de répertoire depuis la version 2.3.3. |

## Utilisation

Lorsqu'elle est activée, cette directive va transmettre l'en-tête `Host:` de la requête entrante vers le serveur mandaté, au lieu du nom d'hôte spécifié par la directive [[13-directives/proxypass|ProxyPass]].

Cette directive est habituellement définie à `Off`. Elle est principalement utile dans les configurations particulières comme l'hébergement virtuel mandaté en masse à base de nom, où l'en-tête Host d'origine doit être évalué par le serveur d'arrière-plan.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

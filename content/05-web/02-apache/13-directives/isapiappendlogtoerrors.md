---
title: "ISAPIAppendLogToErrors"
description: "Directive Apache ISAPIAppendLogToErrors (mod_isapi) — Enregistrement des requêtes HSE_APPEND_LOG_PARAMETER de la part des extensions ISAPI dans le journal des erreurs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_isapi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Enregistrement des requêtes `HSE_APPEND_LOG_PARAMETER` de la part des extensions ISAPI dans le journal des erreurs |
| **Syntaxe** | `ISAPIAppendLogToErrors on\|off` |
| **Valeur par défaut** | `ISAPIAppendLogToErrors off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_isapi\|mod_isapi]] |

## Utilisation

Cette directive permet d'enregistrer les requêtes `HSE_APPEND_LOG_PARAMETER` de la part des extensions ISAPI dans le journal des erreurs.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

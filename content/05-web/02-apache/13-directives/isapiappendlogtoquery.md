---
title: "ISAPIAppendLogToQuery"
description: "Directive Apache ISAPIAppendLogToQuery (mod_isapi) — Enregistre les requêtes HSE_APPEND_LOG_PARAMETER de la part des extensions ISAPI dans la partie arguments de la requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_isapi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Enregistre les requêtes `HSE_APPEND_LOG_PARAMETER` de la part des extensions ISAPI dans la partie arguments de la requête |
| **Syntaxe** | `ISAPIAppendLogToQuery on\|off` |
| **Valeur par défaut** | `ISAPIAppendLogToQuery on` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_isapi\|mod_isapi]] |

## Utilisation

Cette directive permet d'enregistrer les requêtes `HSE_APPEND_LOG_PARAMETER` de la part des extensions ISAPI dans la partie arguments de la requête (ajouté au composant `%q` de la directive [[13-directives/customlog|CustomLog]]).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

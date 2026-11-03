---
title: "ISAPIFakeAsync"
description: "Directive Apache ISAPIFakeAsync (mod_isapi) — Emulation du support des entrées/sorties asynchrones pour les appels ISAPI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_isapi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Emulation du support des entrées/sorties asynchrones pour les appels ISAPI |
| **Syntaxe** | `ISAPIFakeAsync on\|off` |
| **Valeur par défaut** | `ISAPIFakeAsync off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_isapi\|mod_isapi]] |

## Utilisation

Lorsquelle est définie à "on", cette directive permet d'émuler le support des entrées/sorties asynchrones pour les appels ISAPI.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

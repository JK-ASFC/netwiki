---
title: "CookieTracking"
description: "Directive Apache CookieTracking (mod_usertrack) — Active le cookie traceur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_usertrack]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active le cookie traceur |
| **Syntaxe** | `CookieTracking on\|off` |
| **Valeur par défaut** | `CookieTracking off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_usertrack\|mod_usertrack]] |

## Utilisation

Lorsque le module [[12-modules/mod_usertrack|mod_usertrack]] est chargé, et si `CookieTracking on` est définie, Apache enverra un cookie traceur pour toute nouvelle requête. Cette directive peut être utilisée pour activer ou désactiver ce comportement pour un serveur virtuel ou un répertoire. Par défaut, l'activation de [[12-modules/mod_usertrack|mod_usertrack]] ne suffit **pas** pour activer les cookies.

```apache
CookieTracking on
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

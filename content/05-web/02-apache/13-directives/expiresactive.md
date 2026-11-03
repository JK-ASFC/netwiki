---
title: "ExpiresActive"
description: "Directive Apache ExpiresActive (mod_expires) — Active la génération d'en-têtes Expires. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_expires]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la génération d'en-têtes `Expires` |
| **Syntaxe** | `ExpiresActive On\|Off` |
| **Valeur par défaut** | `ExpiresActive Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_expires\|mod_expires]] |

## Utilisation

Cette directive permet d'activer ou de désactiver la génération des en-têtes `Expires` et `Cache-Control` pour les documents concernés ; en d'autres termes, si cette directive se trouve dans un fichier `.htaccess`, par exemple, elle ne s'applique qu'aux documents générés à partir du répertoire considéré. Si elle est définie à `Off`, les en-têtes ne seront générés pour aucun document du domaine considéré (sauf surcharge de la configuration à un niveau inférieur, comme un fichier `.htaccess` qui l'emporterait sur le fichier de configuration du serveur). Si elle est définie à `On`, les en-têtes seront ajoutés aux documents servis en fonction des critères définis par les directives [[13-directives/expiresbytype|ExpiresByType]] et [[13-directives/expiresdefault|ExpiresDefault]] (*voir plus loin*).

Notez que cette directive ne permet pas de garantir qu'un en-tête `Expires` ou `Cache-Control` sera généré. Si les critères ne sont pas respectés, aucun en-tête ne sera généré, et la directive produira le même effet que si elle n'avait pas été définie.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

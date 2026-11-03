---
title: "AuthnCacheEnable"
description: "Directive Apache AuthnCacheEnable (mod_authn_socache) — Active la mise en cache de l'authentification en tout endroit. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_socache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la mise en cache de l'authentification en tout endroit |
| **Syntaxe** | `AuthnCacheEnable` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authn_socache\|mod_authn_socache]] |

## Utilisation

Normalement, cette directive n'est pas nécessaire : l'activation est implicite si la mise en cache de l'authentification a été activée en tout autre endroit du fichier *httpd.conf*. Par contre, si cette mise en cache n'a pas été activée, par défaut, elle ne sera pas initialisée, et ne sera donc pas disponible dans un contexte de fichier *.htaccess*. Cette directive permet d'être sûr que la mise en cache a bien été activée et pourra donc être utilisée dans les fichiers *.htaccess*.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

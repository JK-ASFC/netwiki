---
title: "SSIErrorMsg"
description: "Directive Apache SSIErrorMsg (mod_include) — Message d'erreur affiché lorsqu'une erreur SSI survient. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_include]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Message d'erreur affiché lorsqu'une erreur SSI survient |
| **Syntaxe** | `SSIErrorMsg message` |
| **Valeur par défaut** | `SSIErrorMsg "[an error occurred while processing this directive]"` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Base |
| **Module** | [[12-modules/mod_include\|mod_include]] |

## Utilisation

La directive `SSIErrorMsg` permet de modifier le message d'erreur affiché lorsqu'une erreur SSI survient. Pour les serveurs en production, il est recommandé de modifier le message d'erreur par défaut en `"<!-- Error -->"`, de façon à ce que le message ne soit pas présenté à l'utilisateur.

Cette directive a le même effet que l'élément `<!--#config errmsg=message -->`.

```apache
SSIErrorMsg "<!-- Error -->"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

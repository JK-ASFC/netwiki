---
title: "AddModuleInfo"
description: "Directive Apache AddModuleInfo (mod_info) — Ajoute des données supplémentaires aux informations de module affichées par le gestionnaire server-info. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_info]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute des données supplémentaires aux informations de module affichées par le gestionnaire server-info |
| **Syntaxe** | `AddModuleInfo nom-module chaîne` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_info\|mod_info]] |

## Utilisation

Cette directive permet d'afficher le contenu de *chaîne* en tant qu'**Information supplémentaire** interprétée en HTML pour le module *nom-module*. Exemple :

```apache
AddModuleInfo mod_deflate.c 'See <a \
    href="http://httpd.apache.org/docs/2.4/mod/mod_deflate.html">\
    http://httpd.apache.org/docs/2.4/mod/mod_deflate.html</a>'
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

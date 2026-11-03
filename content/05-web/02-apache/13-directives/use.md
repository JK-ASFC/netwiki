---
title: "Use"
description: "Directive Apache Use (mod_macro) — Utilisation d'une macro. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_macro]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Utilisation d'une macro |
| **Syntaxe** | `Use nom [valeur1 ... valeurN]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_macro\|mod_macro]] |

## Utilisation

La directive `Use` permet d'utiliser une macro. La macro considérée est expansée. Son nombre d'arguments doit être égal au nombre de paramètres précisés dans sa définition. Les valeurs passées en argument sont attribuées aux paramètres correspondants et substituées avant l'interprétation du texte de la macro.

```apache
Use LocalAccessPolicy
...
Use RestrictedAccessPolicy "192.54.172.0/24 192.54.148.0/24"
```

est équivalent, avec les macros définies ci-dessus à :

```apache
Require ip 10.2.16.0/24
...
Require ip 192.54.172.0/24 192.54.148.0/24
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

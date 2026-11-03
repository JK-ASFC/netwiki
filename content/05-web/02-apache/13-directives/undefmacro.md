---
title: "UndefMacro"
description: "Directive Apache UndefMacro (mod_macro) — Supprime une macro. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_macro]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Supprime une macro |
| **Syntaxe** | `UndefMacro nom` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_macro\|mod_macro]] |

## Utilisation

La directive `UndefMacro` annule la définition d'une macro qui doit avoir été définie auparavant.

```apache
UndefMacro LocalAccessPolicy
UndefMacro RestrictedAccessPolicy
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

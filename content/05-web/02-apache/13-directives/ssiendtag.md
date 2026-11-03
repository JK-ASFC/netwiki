---
title: "SSIEndTag"
description: "Directive Apache SSIEndTag (mod_include) — Chaîne qui termine l'élément include. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_include]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chaîne qui termine l'élément include |
| **Syntaxe** | `SSIEndTag tag` |
| **Valeur par défaut** | `SSIEndTag "-->"` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_include\|mod_include]] |

## Utilisation

Cette directive permet de modifier la chaîne que [[12-modules/mod_include|mod_include]] interprète comme la fin d'un élément include.

```apache
SSIEndTag "%>"
```

> [!WARNING]
> La valeur ne doit pas contenir d'espace.

## Voir aussi

- [[13-directives/ssistarttag|SSIStartTag]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

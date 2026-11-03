---
title: "<Macro>"
description: "Directive Apache <Macro> (mod_macro) — Définition d'une macro dans un fichier de configuration. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_macro]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définition d'une macro dans un fichier de configuration |
| **Syntaxe** | `<Macro nom [par1 .. parN]> ... </Macro>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_macro\|mod_macro]] |

## Utilisation

La directive `<Macro>` permet de définir une macro dans un fichier de configuration Apache. Le premier argument est le nom de la macro, et les arguments suivants sont les paramètres. Il est de bon aloi de préfixer les noms des paramètres d'une macro avec un caractère parmi '`$%@`', et d'éviter d'en faire de même avec les noms de macros.

```apache
<Macro LocalAccessPolicy>
  Require ip 10.2.16.0/24
</Macro>

<Macro RestrictedAccessPolicy $ipnumbers>
   Require ip $ipnumbers
</Macro>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

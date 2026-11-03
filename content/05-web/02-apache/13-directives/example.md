---
title: "Example"
description: "Directive Apache Example (mod_example_hooks) — Directive de démonstration pour illustrer l'API des modules Apache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_example_hooks]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Directive de démonstration pour illustrer l'API des modules Apache |
| **Syntaxe** | `Example` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_example_hooks\|mod_example_hooks]] |

## Utilisation

La directive `Example` n'a pour fonction que de définir un drapeau de démonstration que le gestionnaire de contenu du module example\_hooks va afficher. Elle ne possède aucun argument. Si vous naviguez vers une URL à laquelle le gestionnaire de contenu example\_hooks s'applique, vous verrez s'afficher les routines du module, ainsi que l'ordre dans lequel elles ont été appelées pour servir le document demandé. On peut observer l'effet de cette directive dans la phrase "`Example directive declared here: YES/NO`".

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

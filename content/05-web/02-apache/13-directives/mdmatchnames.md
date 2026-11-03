---
title: "MDMatchNames"
description: "Directive Apache MDMatchNames (mod_md) — Définit comment les noms DNS sont comparés aux vhosts. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit comment les noms DNS sont comparés aux vhosts |
| **Syntaxe** | `MDMatchNames all\|servernames` |
| **Valeur par défaut** | `MDMatchNames all` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.58 du serveur HTTP Apache |

## Utilisation

Le mode \`all\` correspond au comportement de toutes les versions précédentes. [[13-directives/servername|ServerName]] et [[13-directives/serveralias|ServerAlias]] sont inspectés pour trouver le [[13-directives/mdomain|MDomain]] qui correspond à un serveur virtuel. Les recouvrements sont automatiquement détectés, même si vous n'avez ajouté qu'un des noms à un MDomain.

Cet automatisme présente cependant des inconvénients avec les configurations plus complexes. Si vous définissez cette directive à \`servernames\`, seul le ServerName d'un serveur virtuel est inspecté pour la correspondance et les ServerAliases sont donc ignorés. Les Aliases seront tout de même ajoutés au certificat obtenu, à moins que vous ne spécifiiez aussi \`MDMembers manual\`.

\`servernames\` possède un autre avantage : il vous confère plus de souplesse avec les sous-domaines et les caractères génériques. Vous pouvez ainsi définir un MDomain avec un caractère générique et avoir d'autres MDomains pour des noms de sous-domaines spécifiques.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

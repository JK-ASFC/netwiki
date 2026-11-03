---
title: "<ElseIf>"
description: "Directive Apache <ElseIf> (core) — Contient des directives qui ne s'appliquent que si la condition correspondante est satisfaite par une requête à l'exécution, alors que la condition correspondant à la section If ou ElseIf précédente ne l'était pas. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contient des directives qui ne s'appliquent que si la condition correspondante est satisfaite par une requête à l'exécution, alors que la condition correspondant à la section [[13-directives/if\|<If>]] ou `<ElseIf>` précédente ne l'était pas. |
| **Syntaxe** | `<ElseIf expression> ... </ElseIf>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Les conditions imbriquées sont supportées à partir de la version 2.4.26 du serveur HTTP Apache |

## Utilisation

La section `<ElseIf>` applique les directives qu'elle contient si et seulement si d'une part la condition correspondante est satisfaite, et d'autre part la condition correspondant à la section `<If>` ou `<ElseIf>` de la même portée ne l'est pas. Par exemple, dans :

```apache
<If "-R '10.1.0.0/16'">
  #...
</If>
<ElseIf "-R '10.0.0.0/8'">
  #...
</ElseIf>
<Else>
  #...
</Else>
```

La condition correspondant à la section `<ElseIf>` est satisfaite si l'adresse distante de la requête appartient au sous-réseau 10.0.0.0/8, mais pas si elle appartient au sous-réseau 10.1.0.0/16.

## Voir aussi

- [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|Les expressions dans le serveur HTTP Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

---
title: "<Else>"
description: "Directive Apache <Else> (core) — Contient des directives qui ne s'appliquent que si la condition correspondant à la section If ou ElseIf précédente n'est pas satisfaite par la requête à l'exécution. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contient des directives qui ne s'appliquent que si la condition correspondant à la section [[13-directives/if\|<If>]] ou [[13-directives/elseif\|<ElseIf>]] précédente n'est pas satisfaite par la requête à l'exécution |
| **Syntaxe** | `<Else> ... </Else>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Les conditions imbriquées sont supportées à partir de la version 2.4.26 du serveur HTTP Apache |

## Utilisation

La section `<Else>` applique les directives qu'elle contient si et seulement si les conditions correspondant à la section `<If>` ou `<ElseIf>` immédiatement supérieure et dans la même portée n'ont pas été satisfaites. Par exemple, dans :

```apache
<If "-z req('Host')">
  # ...
</If>
<Else>
  # ...
</Else>
```

La condition de la section `<If>` serait satisfaite pour les requêtes HTTP/1.0 sans en-tête *Host:*, alors que celle de la section `<Else>` le serait pour les requêtes comportant un en-tête *Host:*.

## Voir aussi

- [[13-directives/if|<If>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

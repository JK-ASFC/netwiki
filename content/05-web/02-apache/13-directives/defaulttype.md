---
title: "DefaultType"
description: "Directive Apache DefaultType (core) — Les seuls effets de cette directive sont des émissions d'avertissements si sa valeur est différente de none. Dans les versions précédentes, DefaultType permettait de spécifier un type de média à assigner par défaut au contenu d'une réponse pour lequel aucun autre type de média n'avait été trouvé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Les seuls effets de cette directive sont des émissions d'avertissements si sa valeur est différente de `none`. Dans les versions précédentes, DefaultType permettait de spécifier un type de média à assigner par défaut au contenu d'une réponse pour lequel aucun autre type de média n'avait été trouvé. |
| **Syntaxe** | `DefaultType type média\|none` |
| **Valeur par défaut** | `DefaultType none` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | L'argument `none` est disponible dans les versions d'Apache httpd 2.2.7 et supérieures. Tous les autres choix sont DESACTIVÉS à partir des version 2.3.x. |

## Utilisation

Cette directive a été désactivée. Pour la compatibilité ascendante avec les anciens fichiers de configuration, elle peut être spécifiée avec la valeur `none`, c'est à dire sans type de médium par défaut. Par exemple :

```apache
DefaultType None
```

`DefaultType None` n'est disponible que dans les versions d'Apache 2.2.7 et supérieures.

Utilisez le fichier de configuration mime.types et la directive [[13-directives/addtype|AddType]] pour configurer l'assignement d'un type de médium via les extensions de fichiers, ou la directive [[13-directives/forcetype|ForceType]] pour attribuer un type de médium à des ressources spécifiques. Dans le cas contraire, le serveur enverra sa réponse sans champ d'en-tête Content-Type, et le destinataire devra déterminer lui-même le type de médium.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

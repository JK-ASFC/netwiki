---
title: "ModMimeUsePathInfo"
description: "Directive Apache ModMimeUsePathInfo (mod_mime) — Indique à mod_mime de traiter les éléments de path_info en tant que parties du nom de fichier. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Indique à [[12-modules/mod_mime\|mod_mime]] de traiter les éléments de `path_info` en tant que parties du nom de fichier |
| **Syntaxe** | `ModMimeUsePathInfo On\|Off` |
| **Valeur par défaut** | `ModMimeUsePathInfo Off` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `ModMimeUsePathInfo` permet de combiner le nom de fichier avec la partie `path_info` de l'URL pour appliquer les directives [[12-modules/mod_mime|mod_mime]] à la requête. La valeur par défaut est `Off` - situation dans laquelle l'élément `path_info` est ignoré.

L'utilisation de cette directive est conseillée si vous utilisez un système de fichiers virtuel.

**Exemple**

```apache
ModMimeUsePathInfo On
```

Considérons une requête pour `/index.php/foo.shtml`, [[12-modules/mod_mime|mod_mime]] ne traitera pas la requête entrante comme `/index.php/foo.shtml` et les directives comme `AddOutputFilter INCLUDES .shtml` ajouteront le filtre `INCLUDES` à la requête. Si la directive `ModMimeUsePathInfo` n'est pas définie, le filtre `INCLUDES` ne sera pas ajouté. Le fonctionnement sera identique dans le cas des chemins virtuels, tels que ceux définis par la directive `<Location>`

## Voir aussi

- [[13-directives/acceptpathinfo|AcceptPathInfo]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

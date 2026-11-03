---
title: "mod_data"
description: "Module Apache mod_data — Convertit un corps de réponse en URL de type données RFC2397. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_data]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Convertit un corps de réponse en URL de type données RFC2397 |
| **Statut** | Extension |
| **Identificateur** | `data_module` |
| **Fichier source** | `mod_data.c` |
| **Compatibilité** | Disponible depuis la version 2.3 du serveur HTTP Apache |

## Sommaire

Ce module permet de convertir une réponse en [RFC 2397](https://www.rfc-editor.org/rfc/rfc2397) (URL de type données.

Les URLs de type données peuvent être incluses en ligne dans les pages web via le module [[12-modules/mod_include|mod_include]] par exemple, afin d'éviter aux clients d'avoir à effectuer des connexions séparées pour éventuellement extraire un grand nombre de petites images. Les URLs de type données peuvent aussi être incluses dans des pages générées par langages de scripting tels que PHP.

**Un exemple d'URL de type données**

```
data:image/gif;base64,R0lGODdhMAAwAPAAAAAAAP///ywAAAAAMAAw
AAAC8IyPqcvt3wCcDkiLc7C0qwyGHhSWpjQu5yqmCYsapyuvUUlvONmOZtfzgFz
ByTB10QgxOR0TqBQejhRNzOfkVJ+5YiUqrXF5Y5lKh/DeuNcP5yLWGsEbtLiOSp
a/TPg7JpJHxyendzWTBfX0cxOnKPjgBzi4diinWGdkF8kjdfnycQZXZeYGejmJl
ZeGl9i2icVqaNVailT6F5iJ90m6mvuTS4OK05M0vDk0Q4XUtwvKOzrcd3iq9uis
F81M1OIcR7lEewwcLp7tuNNkM3uNna3F2JQFo97Vriy/Xl4/f1cf5VWzXyym7PH
hhx4dbgYKAAA7
```

Le filtre n'accepte aucun paramètre, et peut être ajouté à la pile des filtres via la directive [[13-directives/setoutputfilter|SetOutputFilter]], ou toute autre directive supportée par le module [[12-modules/mod_filter|mod_filter]].

**Configuration du filtre**

```apache
<Location "/data/images">
    SetOutputFilter DATA
</Location>
```

## Voir aussi

- [[11-guides/01-generalites/filtres|Les filtres]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

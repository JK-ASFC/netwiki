---
title: "<LocationMatch>"
description: "Directive Apache <LocationMatch> (core) — N'applique les directives contenues qu'aux URLs correspondant à une expression rationnelle. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | N'applique les directives contenues qu'aux URLs correspondant à une expression rationnelle |
| **Syntaxe** | `<LocationMatch regex> ... </LocationMatch>` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `<LocationMatch>` limite la portée des directives contenues à l'URL spécifiée, de manière identique à la directive [[13-directives/location|<Location>]]. Mais son argument permettant de spécifier les URLs concernées est une expression rationnelle au lieu d'une simple chaîne de caractères. Par exemple :

```apache
<LocationMatch "/(extra|special)/data">
    # ...
</LocationMatch>
```

correspondrait à toute URL contenant les sous-chaînes `/extra/data` ou `/special/data`.

> [!NOTE]
> Si vous recherchez une URL **commençant par** plutôt que seulement contenant `/extra/data`, préfixez l'expression rationnelle avec un `^`.
>
> ```apache
> <LocationMatch "^/(extra|special)/data">
> ```

A partir de la version 2.4.8, les groupes nommés et les références arrières sont extraits et enregistrés dans l'environnement avec leur nom en majuscules et préfixé par "MATCH\_". Ceci permet de référencer des URLs dans des [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]] ou au sein de modules comme [[12-modules/mod_rewrite|mod_rewrite]]. Pour éviter toute confusion, les références arrières numérotées (non nommées) sont ignorées. Vous devez utiliser à la place des groupes nommés.

```apache
<LocationMatch "^/combined/(?<sitename>[^/]+)">
    Require ldap-group cn=%{env:MATCH_SITENAME},ou=combined,o=Example
</LocationMatch>
```

> [!NOTE]
> **Note à propos du slash '/'**
>
> La signification du caractère slash '/' dépend de l'endroit où il apparaît dans une URL. Les utilisateurs sont habitués à voir de multiples slashes adjacents réduits à un seul au sein du système de fichiers (par exemple, `/home///foo` est équivalent à `/home/foo`). Ce n'est n'est cependant pas toujours vrai au sein des URLs si la directive [[13-directives/mergeslashes|MergeSlashes]] a été définie à "OFF". En effet, si vous souhaitez spécifier plusieurs slashes, vous devez le faire explicitement au sein de la directive [[13-directives/locationmatch|<LocationMatch>]] et de la version regex de la directive `<Location>`, si les slashes ne sont pas fusionnés.
>
> Par exemple, `<LocationMatch "^/abc">` correspondra à l'URL `/abc`, mais pas à l'URL `//abc`. La directive (non-regex) `<Location>` se comporte de la même manière lorsqu'elle est utilisée dans les requêtes de mandataire. Par contre, pour les autres types de requêtes, la directive `<Location>` considérera plusieurs slashes adjacents comme équivalents à un seul slash. Par exemple, si vous spécifiez `<Location "/abc/def">`, une requête pour `/abc//def` correspondra.

## Voir aussi

- [[11-guides/01-generalites/sections-de-configuration|Comment fonctionnent les sections <Directory>, <Location> et <Files>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

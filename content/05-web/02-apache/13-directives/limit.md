---
title: "<Limit>"
description: "Directive Apache <Limit> (core) — Limite les contrôles d'accès que la section contient à certaines méthodes HTTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Limite les contrôles d'accès que la section contient à certaines méthodes HTTP |
| **Syntaxe** | `<Limit méthode [méthode] ... > ... </Limit>` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig, Limit |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Les contrôles d'accès s'appliquent normalement à **toutes** les méthodes d'accès, et c'est en général le comportement souhaité. **Dans le cas général, les directives de contrôle d'accès n'ont pas à être placées dans une section `<Limit>`.**

La directive `<Limit>` a pour but de limiter les effets des contrôles d'accès aux méthodes HTTP spécifiées. Pour toutes les autres méthodes, les restrictions d'accès contenues dans la section `<Limit>` **n'auront aucun effet**. L'exemple suivant n'applique les contrôles d'accès qu'aux méthodes `POST`, `PUT`, et `DELETE`, en laissant les autres méthodes sans protection :

```apache
<Limit POST PUT DELETE>
  Require valid-user
</Limit>
```

La liste des noms de méthodes peut contenir une ou plusieurs valeurs parmi les suivantes : `GET`, `POST`, `PUT`, `DELETE`, `CONNECT`, `OPTIONS`, `PATCH`, `PROPFIND`, `PROPPATCH`, `MKCOL`, `COPY`, `MOVE`, `LOCK`, et `UNLOCK`. **Le nom de méthode est sensible à la casse.** Si la valeur `GET` est présente, les requêtes `HEAD` seront aussi concernées. La méthode `TRACE` ne peut pas être limitée (voir la directive [[13-directives/traceenable|TraceEnable]]).

> [!WARNING]
> Une section `<LimitExcept>` doit toujours être préférée à une section `<Limit>` pour la restriction d'accès, car une section [[13-directives/limitexcept|<LimitExcept>]] fournit une protection contre les méthodes arbitraires. Voir aussi la [[11-guides/01-generalites/sections-de-configuration|documentation sur la fusion des sections de configuration]] pour un avertissement à propos de la manière dont une directive `<Limit>` au sein d’une section [[13-directives/location|<Location>]] peut outrepasser silencieusement les directives d’une section [[13-directives/directory|<Directory>]].

Les directives `<Limit>` et [[13-directives/limitexcept|<LimitExcept>]] peuvent être imbriquées. Dans ce cas, pour chaque niveau des directives `<Limit>` ou [[13-directives/limitexcept|<LimitExcept>]], ces dernières doivent restreindre l'accès pour les méthodes auxquelles les contrôles d'accès s'appliquent.

> [!WARNING]
> Lorsqu'on utilise les directives `<Limit>` ou `<LimitExcept>` avec la directive [[13-directives/require|Require]], la première directive [[13-directives/require|Require]] dont la condition est satisfaite autorise la requête, sans tenir compte de la présence d'autres directives [[13-directives/require|Require]].

Par exemple, avec la configuration suivante, tous les utilisateurs seront autorisés à effectuer des requêtes `POST`, et la directive `Require group editors` sera ignorée dans tous les cas :

```apache
<LimitExcept GET>
  Require valid-user
</LimitExcept>
<Limit POST>
  Require group editors
</Limit>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

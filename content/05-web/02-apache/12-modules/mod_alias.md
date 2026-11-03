---
title: "mod_alias"
description: "Module Apache mod_alias — Permet d'atteindre différentes parties du système de fichiers depuis l'arborescence des documents du site web, ainsi que la redirection d'URL. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_alias]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet d'atteindre différentes parties du système de fichiers depuis l'arborescence des documents du site web, ainsi que la redirection d'URL |
| **Statut** | Base |
| **Identificateur** | `alias_module` |
| **Fichier source** | `mod_alias.c` |

## Sommaire

Les directives fournies par ce module permettent de manipuler et de contrôler les URLs à l'arrivée des requêtes sur le serveur. Les directives [[13-directives/alias|Alias]] et [[13-directives/scriptalias|ScriptAlias]] permettent de faire correspondre des URLs avec des chemins du système de fichiers. Ceci permet de servir des contenus qui ne sont pas situés dans l'arborescence de [[13-directives/documentroot|DocumentRoot]] comme s'ils y étaient réellement. La directive [[13-directives/scriptalias|ScriptAlias]] a pour effet supplémentaire de marquer le répertoire cible comme conteneur de scripts CGI.

Les directives [[13-directives/redirect|Redirect]] indiquent aux clients qu'ils doivent effectuer une nouvelle requête avec une URL différente. Elles sont souvent utilisées lorsqu'une ressource a été déplacée.

Lorsque les directives [[13-directives/alias|Alias]], [[13-directives/scriptalias|ScriptAlias]] ou [[13-directives/redirect|Redirect]] sont définies au sein d'une section [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]], vous pouvez utiliser la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|syntaxe des expressions]] pour manipuler l'URL ou le chemin de destination.

[[12-modules/mod_alias|mod_alias]] est conçu pour traiter des tâches simples de manipulation d'URL. Pour des tâches plus complexes comme la manipulation des chaînes d'arguments des requêtes, utilisez plutôt les outils fournis par le module [[12-modules/mod_rewrite|mod_rewrite]]

## Chronologie du traitement

Les alias et redirections apparaissant dans différents contextes sont traités comme les autres directives en respectant les [[11-guides/01-generalites/sections-de-configuration|règles de fusion]] standards. Par contre, ils sont traités selon une chronologie particulière lorsqu'ils apparaissent dans le même contexte (par exemple, dans la même section [[13-directives/virtualhost|<VirtualHost>]]).

Premièrement, toutes les redirections sont traitées avant les alias, et ainsi, une requête qui correspond à une directive [[13-directives/redirect|Redirect]] ou [[13-directives/redirectmatch|RedirectMatch]] ne se verra jamais appliquer d'alias. Deuxièmement, les alias et redirections sont traités selon l'ordre dans lequel ils apparaissent dans le fichier de configuration, seule la première correspondance étant prise en compte.

Ainsi, lorsqu'une ou plusieurs de ces directives s'appliquent au même sous-répertoire, vous devez classer les chemins du plus précis au moins précis afin que toutes les directives puissent éventuellement s'appliquer, comme dans l'exemple suivant :

```apache
Alias "/foo/bar" "/baz"
Alias "/foo" "/gaq"
```

Si l'ordre des directives était inversé, la directive [[13-directives/alias|Alias]] ayant pour argument `/foo` serait toujours appliquée avant la directive [[13-directives/alias|Alias]] ayant pour argument `/foo/bar`, et cette dernière serait toujours ignorée.

La définition de directives [[13-directives/alias|Alias]], [[13-directives/scriptalias|ScriptAlias]] ou [[13-directives/redirect|Redirect]] au sein de sections [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]] l'emporte sur d'autres définitions éventuelles de ces mêmes directives au niveau de la configuration générale du serveur.

## Directives

- [[13-directives/alias|Alias]]
- [[13-directives/aliasmatch|AliasMatch]]
- [[13-directives/redirect|Redirect]]
- [[13-directives/redirectmatch|RedirectMatch]]
- [[13-directives/redirecttemp|RedirectTemp]]
- [[13-directives/redirectpermanent|RedirectPermanent]]
- [[13-directives/scriptalias|ScriptAlias]]
- [[13-directives/scriptaliasmatch|ScriptAliasMatch]]
- [[13-directives/redirectrelative|RedirectRelative]]
- [[13-directives/aliaspreservepath|AliasPreservePath]]

## Voir aussi

- [[12-modules/mod_rewrite|mod_rewrite]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

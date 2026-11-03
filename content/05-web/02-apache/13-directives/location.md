---
title: "<Location>"
description: "Directive Apache <Location> (core) — N'applique les directives contenues qu'aux URLs spécifiées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | N'applique les directives contenues qu'aux URLs spécifiées |
| **Syntaxe** | `<Location chemin URL\|URL> ... </Location>` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `<Location>` limite la portée des directives contenues aux URLs définies par l'argument URL. Elle est similaire à la directive [[13-directives/directory|<Directory>]], et marque le début d'une section qui se termine par une directive `</Location>`. Les sections `<Location>` sont traitées selon l'ordre dans lequel elles apparaissent dans le fichier de configuration, mais après les sections [[13-directives/directory|<Directory>]] et la lecture des fichiers `.htaccess`, et après les sections [[13-directives/files|<Files>]].

Les sections `<Location>` agissent complètement en dehors du système de fichiers. Ceci a de nombreuses conséquences. Parmi les plus importantes, on ne doit pas utiliser les sections `<Location>` pour contrôler l'accès aux répertoires du système de fichiers. Comme plusieurs URLs peuvent correspondre au même répertoire du système de fichiers, un tel contrôle d'accès pourrait être contourné.

Les directives que contient cette section seront appliquées aux requêtes si la partie chemin de l'URL satisfait à l'un au moins de ces critères :

- Le chemin spécifié correspond exactement à la partie chemin de l'URL.
- Le chemin spécifié, qui se termine par un slash, est un préfixe de la partie chemin de l'URL (traité comme une racine du contexte).
- Le chemin spécifié, si on lui ajoute un slash de fin, est un préfixe de la partie chemin de l'URL (aussi traité comme une racine du contexte).

Dans l'exemple ci-dessous, où aucun slash de fin n'est utilisé, les directives contenues dans la section s'appliqueront à /private1, /private1/ et /private1/file.txt, mais pas à /private1other.

```apache
<Location "/private1">
    #  ...
</Location>
```

De même, dans l'exemple ci-dessous, où l'on utilise un slash de fin, les directives contenues dans la section s'appliqueront à /private2/ et à /private2/file.txt, mais pas à /private2other.

```apache
<Location "/private2/">
    # ...
</Location>
```

> [!NOTE]
> **Quand utiliser la section `<Location>`**
>
> Vous pouvez utiliser une section `<Location>` pour appliquer des directives à des contenus situés en dehors du système de fichiers. Pour les contenus situés à l'intérieur du système de fichiers, utilisez plutôt les sections [[13-directives/directory|<Directory>]] et [[13-directives/files|<Files>]]. `<Location "/">` constitue une exception et permet d'appliquer aisément une configuration à l'ensemble du serveur.

Pour toutes les requêtes originales (non mandatées), l'argument URL est un chemin d'URL de la forme `/chemin/`. *Aucun protocole, nom d'hôte, port, ou chaîne de requête ne doivent apparaître.* Pour les requêtes mandatées, l'URL à comparer dépend du type de mandataire. Avec un mandataire **direct (forward)** (configuré via [[13-directives/proxyrequests|ProxyRequests]]), l'URL à comparer doit être de la forme `protocole://nom_serveur/chemin`, et vous devez inclure le préfixe. Avec un mandataire **inverse (reverse)** (configuré via [[13-directives/proxypass|ProxyPass]] ou `RewriteRule ... [P]`), la requête arrive en tant que chemin d’URL local ; il faut donc utiliser `/chemin/`, comme vous le feriez pour la requête originale.

L'URL peut contenir des caractères génériques. Dans une chaîne avec caractères génériques, `?` correspond à un caractère quelconque, et `*` à toute chaîne de caractères. Les caractères génériques ne peuvent pas remplacer un / dans le chemin URL.

On peut aussi utiliser les Expressions rationnelles, moyennant l'addition d'un caractère `~`. Par exemple :

```apache
<Location ~ "/(extra|special)/data">
    #...
</Location>
```

concernerait les URLs contenant les sous-chaîne `/extra/data` ou `/special/data`. La directive [[13-directives/locationmatch|<LocationMatch>]] présente un comportement identique à la version avec expressions rationnelles de la directive `<Location>`, et son utilisation est préférable à l'utilisation de cette dernière pour la simple raison qu'il est difficile de distinguer `~` de `-` dans la plupart des fontes.

La fonctionnalité `<Location>` est particulièrement utile avec la directive [[13-directives/sethandler|SetHandler]]. Par exemple, pour activer les requêtes d'état, mais ne les autoriser que depuis des navigateurs appartenant au domaine `example.com`, vous pouvez utiliser :

```apache
<Location "/status">
  SetHandler server-status
  Require host example.com
</Location>
```

> [!NOTE]
> **Note à propos du slash (/)**
>
> La signification du caractère slash dépend de l'endroit où il se trouve dans l'URL. Les utilisateurs peuvent être habitués à son comportement dans le système de fichiers où plusieurs slashes successifs sont souvent réduits à un slash unique (en d'autres termes, `/home///foo` est identique à `/home/foo`). Dans l'espace de nommage des URLs, ce n'est cependant pas toujours vrai si la directive [[13-directives/mergeslashes|MergeSlashes]] a été définie à "OFF". Pour la directive [[13-directives/locationmatch|<LocationMatch>]] et la version avec expressions rationnelles de la directive `<Location>`, vous devez spécifier explicitement les slashes multiples si les slashes ne sont pas fusionnés.
>
> Par exemple, `<LocationMatch "^/abc">` va correspondre à l'URL `/abc` mais pas à l'URL `//abc`. La directive `<Location>` sans expression rationnelle se comporte de la même manière lorsqu'elle est utilisée pour des requêtes mandatées. Par contre, lorsque la directive `<Location>` sans expression rationnelle est utilisée pour des requêtes non mandatées, elle fera correspondre implicitement les slashes multiples à des slashes uniques. Par exemple, si vous spécifiez `<Location "/abc/def">`, une requête de la forme `/abc//def` correspondra.

## Voir aussi

- [[11-guides/01-generalites/sections-de-configuration|Comment fonctionnent les sections <Directory>, <Location> et <Files>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

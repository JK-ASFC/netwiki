---
title: "<Files>"
description: "Directive Apache <Files> (core) — Contient des directives qui s'appliquent aux fichiers précisés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contient des directives qui s'appliquent aux fichiers précisés |
| **Syntaxe** | `<Files nom fichier> ... </Files>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `<Files>` limite la portée des directives qu'elle contient aux fichiers précisés. Elle est comparable aux directives [[13-directives/directory|<Directory>]] et [[13-directives/location|<Location>]]. Elle doit se terminer par une balise `</Files>`. Les directives contenues dans cette section s'appliqueront à tout objet dont le nom de base (la dernière partie du nom de fichier) correspond au fichier spécifié. Les sections `<Files>` sont traitées selon l'ordre dans lequel elles apparaissent dans le fichier de configuration, après les sections [[13-directives/directory|<Directory>]] et la lecture des fichiers `.htaccess`, mais avant les sections [[13-directives/location|<Location>]]. Notez que les sections `<Files>` peuvent être imbriquées dans les sections [[13-directives/directory|<Directory>]] afin de restreindre la portion du système de fichiers à laquelle ces dernières vont s'appliquer.

L'argument *filename* peut contenir un nom de fichier ou une chaîne de caractères avec caractères génériques, où `?` remplace un caractère, et `*` toute chaîne de caractères.

```apache
<Files "cat.html">
    # Insérer ici des directives qui s'appliquent au fichier cat.html
</Files>

<Files "?at.*">
    # Les directives insérées ici s'appliqueront aux fichiers
    # cat.html, bat.html, hat.php, et ainsi de suite.
</Files>
```

On peut aussi utiliser les Expressions rationnelles en ajoutant la caractère `~`. Par exemple :

```apache
<Files ~ "\.(gif|jpe?g|png)$">
    #...
</Files>
```

correspondrait à la plupart des formats graphiques de l'Internet. Il est cependant préférable d'utiliser la directive [[13-directives/filesmatch|<FilesMatch>]].

Notez qu'à la différence des sections [[13-directives/directory|<Directory>]] et [[13-directives/location|<Location>]], les sections `<Files>` peuvent être utilisées dans les fichiers `.htaccess`. Ceci permet aux utilisateurs de contrôler l'accès à leurs propres ressources, fichier par fichier.

## Voir aussi

- [[11-guides/01-generalites/sections-de-configuration|Comment fonctionnent les sections <Directory>, <Location> et <Files>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

---
title: "Alias"
description: "Directive Apache Alias (mod_alias) — Met en correspondance des URLs avec des chemins du système de fichiers. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Met en correspondance des URLs avec des chemins du système de fichiers |
| **Syntaxe** | `Alias [chemin URL] chemin fichier\|chemin répertoire` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_alias\|mod_alias]] |

## Utilisation

La directive `Alias` permet de stocker des documents (destinés à être servis) dans des zones du système de fichiers situées en dehors de l'arborescence du site web [[13-directives/documentroot|DocumentRoot]]. Les URLs dont le chemin (décodé avec caractères %) commence par *chemin URL* seront mises en correspondance avec des fichiers locaux dont le chemin commence par *chemin répertoire*. Le *chemin URL* est sensible à la casse, même sur les systèmes de fichiers insensibles à la casse.

```apache
Alias "/image" "/ftp/pub/image"
```

Une requête pour `http://example.com/image/foo.gif` fera renvoyer par le serveur le fichier `/ftp/pub/image/foo.gif`. Seuls les éléments de chemin complets sont testés ; ainsi l'alias précédent ne conviendra pas pour une requête du style `http://example.com/imagefoo.gif`. Pour des mises en correspondance plus complexes faisant intervenir les expressions rationnelles, veuillez vous reporter à la directive [[13-directives/aliasmatch|AliasMatch]].

Notez que si vous ajoutez un slash de fin au *chemin URL*, vous devrez aussi ajouter un slash de fin au chemin de la requête. Autrement dit, si vous définissez

```apache
Alias "/icons/" "/usr/local/apache/icons/"
```

l'alias précédent ne s'appliquera pas à l'URL `/icons` à cause de l'absence du slash final. Ainsi, si le slash final est absent du *chemin de l'URL*, il doit aussi l'être du *chemin du fichier*.

Notez qu'il pourra s'avérer nécessaire de définir des sections [[13-directives/directory|<Directory>]] supplémentaires qui couvriront la *destination* des alias. Le traitement des alias intervenant avant le traitement des sections [[13-directives/directory|<Directory>]], seules les cibles des alias sont affectées (Notez cependant que les sections [[13-directives/location|<Location>]] sont traitées avant les alias, et s'appliqueront donc).

En particulier, si vous créez un alias ayant pour cible un répertoire situé en dehors de l'arborescence de votre site web [[13-directives/documentroot|DocumentRoot]], vous devrez probablement permettre explicitement l'accès à ce répertoire.

```apache
Alias "/image" "/ftp/pub/image"
<Directory "/ftp/pub/image">
    Require all granted
</Directory>
```

Le nombre de slashes dans le paramètre *chemin URL* doit correspondre au nombre de slashes dans le chemin URL de la requête.

Si la directive `Alias` est définie au sein d'une section [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]], *chemin URL* est omis et *chemin fichier* est interprété en utilisant la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|syntaxe des expressions]].
Cette syntaxe est disponible à partir de la version 2.4.19 du serveur HTTP Apache.

```apache
<Location "/image">
    Alias "/ftp/pub/image"
</Location>
<LocationMatch "/error/(?<NUMBER>[0-9]+)">
    Alias "/usr/local/apache/errors/%{env:MATCH_NUMBER}.html"
</LocationMatch>
```

Notez que lorsque la directive `AliasPreservePath` est à "on", la destination contient le chemin entier, alors que lorsque la directive `AliasPreservePath` est à "off", tous les URLs sont associés à l'URL cible unique.

```apache
# /files/foo et /files/bar associés à /ftp/pub/files/foo et /ftp/pub/files/bar
<Location "/files">
    AliasPreservePath on
    Alias "/ftp/pub/files"
</Location>
# /errors/foo et /errors/bar associés à /var/www/errors.html
<Location "/errors">
    AliasPreservePath off
    Alias "/var/www/errors.html"
</Location>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

---
title: "SetHandler"
description: "Directive Apache SetHandler (core) — Force le traitement des fichiers spécifiés par un gestionnaire particulier. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Force le traitement des fichiers spécifiés par un gestionnaire particulier |
| **Syntaxe** | `SetHandler handler-name\|none\|expression` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | L'argument expression est disponible à partir de la version 2.4.19 su serveur HTTP Apache |

## Utilisation

Lorsqu'elle se situe à l'intérieur d'un fichier `.htaccess`, ou d'une section [[13-directives/directory|<Directory>]] ou [[13-directives/location|<Location>]], cette directive force le traitement de tous les fichiers spécifiés par le [[11-guides/01-generalites/utilisation-des-gestionnaires-d-apache-handlers|gestionnaire]] défini par l'argument *nom gestionnaire*. Par exemple, dans le cas d'un répertoire dont vous voulez interpréter le contenu comme des fichiers de règles d'images cliquables, sans tenir compte des extensions, vous pouvez ajouter la ligne suivante dans un fichier `.htaccess` de ce répertoire :

```apache
SetHandler imap-file
```

Autre exemple : si vous voulez que le serveur affiche un compte-rendu d'état chaque fois qu'une URL du type `http://nom serveur/status` est appelée, vous pouvez ajouter ceci dans `httpd.conf` :

```apache
<Location "/status">
  SetHandler server-status
</Location>
```

Vous pouvez aussi utiliser cette directive pour associer un gestionnaire à des fichiers possèdant une extension de nom de fichier particulière. Par exemple :

```apache
<FilesMatch "\.php$">
    SetHandler application/x-httpd-php
</FilesMatch>
```

Pour référencer des variables spécifiques à une requête, y compris les références arrières vers des expressions rationnelles nommées, vous pouvez utiliser des expressions ayant pour valeur une chaîne :

```apache
<LocationMatch ^/app/(?<sub>[^/]+)/>
     SetHandler "proxy:unix:/var/run/app_%{env:MATCH_sub}.sock|fcgi://localhost:8080"
</LocationMatch>
```

Vous pouvez écraser la définition antérieure d'une directive `SetHandler` en utilisant la valeur `None`.

> [!NOTE]
> **Note**
>
> Comme `SetHandler` l'emporte sur la définition des gestionnaires par défaut, le comportement habituel consistant à traiter les URLs se terminant par un slash (/) comme des répertoires ou des fichiers index est désactivé. Cette directive outrepasse aussi la directive [[13-directives/fallbackresource|FallbackResource]], car un gestionnaire est déjà explicitement assigné à la requête.

## Voir aussi

- [[13-directives/addhandler|AddHandler]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

---
title: "DirectoryIndex"
description: "Directive Apache DirectoryIndex (mod_dir) — Liste des fichiers ressources à rechercher lorsque le client envoie une requête pour un répertoire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dir]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Liste des fichiers ressources à rechercher lorsque le client envoie une requête pour un répertoire |
| **Syntaxe** | `DirectoryIndex disabled \| url locale [url locale] ...` |
| **Valeur par défaut** | `DirectoryIndex index.html` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_dir\|mod_dir]] |

## Utilisation

La directive `DirectoryIndex` permet de définir une liste de fichiers ressources à rechercher lorsqu'un client envoie une requête pour l'index d'un répertoire, en ajoutant un '/' à la fin du nom de ce dernier. *url locale* est l'URL (codée avec caractères '%') d'un document du serveur, relative au répertoire faisant l'objet de la requête ; il s'agit en général du nom d'un fichier situé dans le répertoire. Si plusieurs URLs sont fournies, le serveur renverra la première d'entre elles qui correspond à une ressource existante. Si aucune ressource ne correspond à la liste des URLs spécifiées, et si l'option `Indexes` est définie, le serveur générera son propre listing du répertoire.

**Exemple**

```apache
DirectoryIndex index.html
```

Avec cette configuration, une requête pour l'URL `http://example.com/docs/` renverrait au client la ressource `http://example.com/docs/index.html` si elle existe, ou provoquerait la génération du listing du répertoire si la ressource n'existe pas.

Notez qu'il n'est pas nécessaire que les documents soient relatifs au répertoire ;

```apache
DirectoryIndex index.html index.txt  /cgi-bin/index.pl
```

provoquerait l'exécution du script CGI `/cgi-bin/index.pl` si aucun des fichiers `index.html` ou `index.txt` n'existe dans le répertoire considéré.

La spécification du seul argument "disabled" empêche [[12-modules/mod_dir|mod_dir]] de rechercher un index. Un argument "disabled" sera interprété de manière littérale si d'autres arguments sont présents avant ou après lui, même s'ils sont eux-mêmes des arguments "disabled".

> [!NOTE]
> La définition de plusieurs directives `DirectoryIndex` au sein d'un [[11-guides/01-generalites/sections-de-configuration|même contexte]] permet d'ajouter des ressources à rechercher plutôt que de remplacer celle déjà définies :

```apache
# Exemple A: définit index.html comme page d'index, ainsi qu'index.php.
<Directory "/foo">
    DirectoryIndex index.html
    DirectoryIndex index.php
</Directory>

# Exemple B: identique à l'exemple A, mais avec une seule directive.
<Directory "/foo">
    DirectoryIndex index.html index.php
</Directory>

# Exemple C: pour remplacer la liste des pages d'index par une autre,
# vous devez tout d'abord supprimer la première liste : dans l'exemple
# suivant, il ne restera qu'index.php comme page d'index.
<Directory "/foo">
    DirectoryIndex index.html
    DirectoryIndex disabled
    DirectoryIndex index.php
</Directory>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

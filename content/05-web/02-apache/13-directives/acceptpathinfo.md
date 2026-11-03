---
title: "AcceptPathInfo"
description: "Directive Apache AcceptPathInfo (core) — Les ressources acceptent des informations sous forme d'un nom de chemin en fin de requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Les ressources acceptent des informations sous forme d'un nom de chemin en fin de requête. |
| **Syntaxe** | `AcceptPathInfo On\|Off\|Default` |
| **Valeur par défaut** | `AcceptPathInfo Default` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette directive permet de définir si les requêtes contenant des informations sous forme d'un nom de chemin suivant le nom d'un fichier réel (ou un fichier qui n'existe pas dans un répertoire qui existe) doivent être acceptées ou rejetées. Les scripts peuvent accéder à cette information via la variable d'environnement `PATH_INFO`.

Supposons par exemple que `/test/` pointe vers un répertoire qui ne contient que le fichier `here.html`. Les requêtes pour `/test/here.html/more` et `/test/nothere.html/more` vont affecter la valeur `/more` à la variable d'environnement `PATH_INFO`.

L'argument de la directive `AcceptPathInfo` possède trois valeurs possibles :

**`Off`**

Une requête ne sera acceptée que si elle correspond à un chemin qui existe. Par conséquent, une requête contenant une information de chemin après le nom de fichier réel comme `/test/here.html/more` dans l'exemple ci-dessus renverra une erreur "404 NOT FOUND".

**`On`**

Une requête sera acceptée si la partie principale du chemin correspond à un fichier existant. Dans l'exemple ci-dessus `/test/here.html/more`, la requête sera acceptée si `/test/here.html` correspond à un nom de fichier valide.

**`Default`**

Le traitement des requêtes est déterminé par le [[11-guides/01-generalites/utilisation-des-gestionnaires-d-apache-handlers|gestionnaire]] responsable de la requête. Le gestionnaire de base pour les fichiers normaux rejette par défaut les requêtes avec `PATH_INFO`. Les gestionnaires qui servent des scripts, comme[[12-modules/mod_cgi|cgi-script]] et [[12-modules/mod_isapi|isapi-handler]], acceptent en général par défaut les requêtes avec `PATH_INFO`.

Le but premier de la directive `AcceptPathInfo` est de vous permettre de remplacer le choix du gestionnaire d'accepter ou de rejeter `PATH_INFO`. Ce remplacement est nécessaire par exemple, lorsque vous utilisez un [[11-guides/01-generalites/filtres|filtre]], comme [[12-modules/mod_include|INCLUDES]], pour générer un contenu basé sur `PATH_INFO`. Le gestionnaire de base va en général rejeter la requête, et vous pouvez utiliser la configuration suivante pour utiliser un tel script :

```apache
<Files "mypaths.shtml">
  Options +Includes
  SetOutputFilter INCLUDES
  AcceptPathInfo On
</Files>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

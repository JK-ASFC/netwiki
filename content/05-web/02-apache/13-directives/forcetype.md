---
title: "ForceType"
description: "Directive Apache ForceType (core) — Force le type de médium spécifié dans le champ d'en-tête HTTP Content-Type pour les fichiers correspondants. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Force le type de médium spécifié dans le champ d'en-tête HTTP Content-Type pour les fichiers correspondants |
| **Syntaxe** | `ForceType type médium\|None` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Lorsqu'elle est placée dans un fichier `.htaccess` ou une section [[13-directives/directory|<Directory>]], [[13-directives/location|<Location>]], ou [[13-directives/files|<Files>]], cette directive force l'identification du type MIME des fichiers spécifiés à la valeur de l'argument *type médium*. Par exemple, si vous possédez un répertoire ne contenant que des fichiers GIF, et si vous ne voulez pas leur ajouter l'extension `.gif`, vous pouvez utiliser :

```apache
ForceType image/gif
```

Notez que cette directive l'emporte sur d'autres associations de type de médium indirectes définies dans mime.types ou via la directive [[13-directives/addtype|AddType]].

Vous pouvez aussi annuler toute définition plus générale de `ForceType` en affectant la valeur `None` à l'argument *type médium* :

```apache
# force le type MIME de tous les fichiers à image/gif:
<Location "/images">
  ForceType image/gif
</Location>

# mais utilise les méthodes classiques d'attribution du type MIME
# dans le sous-répertoire suivant :
<Location "/images/mixed">
  ForceType None
</Location>
```

A la base, cette directive écrase le type de contenu généré pour les fichiers statiques servis à partir du sytème de fichiers. Pour les ressources autres que les fichiers statiques pour lesquels le générateur de réponse spécifie en général un type de contenu, cette directive est ignorée.

> [!NOTE]
> **Note**
>
> Lorsque des directives explicites comme [[13-directives/sethandler|SetHandler]] ou `module="mod_mime">AddHandler` ne s'appliquent pas à la requête courante, le nom du gestionnaire interne normalement défini par ces directives correspondra alors au type de contenu spécifié par cette directive. Il s'agit d'un comportement historique que certains modules tiers, comme mod\_php, peuvent interpréter comme un type de contenu artificiel ne servant qu'à indiquer le module qui doit prendre en compte la requête considérée. Dans la mesure du possible, il est conseillé d'éviter les configurations qui comportent de tels types artificiels en utilisant les directives [[13-directives/sethandler|SetHandler]] ou [[13-directives/addhandler|AddHandler]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

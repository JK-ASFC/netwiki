---
title: "AddType"
description: "Directive Apache AddType (mod_mime) — Associe les extensions de noms de fichiers au type de contenu spécifié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Associe les extensions de noms de fichiers au type de contenu spécifié |
| **Syntaxe** | `AddType type-médium extension [extension] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `AddType` permet d'associer les extensions de noms fichiers données au type de contenu spécifié. *type-médium* est le Type MIME à utiliser pour les fichiers dont le nom possède l'extension *extension*. Cette association s'ajoute à toute autre association en vigueur, et l'emporte sur toute association préexistante pour la même *extension*.

> [!NOTE]
> Plutôt que d'éditer directement le fichier [[13-directives/typesconfig|TypesConfig]], il est recommandé d'utiliser la directive `AddType` pour ajouter de nouveaux types de médias.

**Exemple**

```apache
AddType image/gif .gif
```

Ou, pour spécifier plusieurs extensions dans une seule directive :

**Exemple**

```apache
AddType image/jpeg jpeg jpg jpe
```

L'argument *extension* est insensible à la casse et peut être spécifié avec ou sans le point initial. Les noms de fichiers peuvent posséder plusieurs extensions, et l'argument *extension* sera comparé à chacune d'entre elles.

Il est possible d'obtenir un effet similaire à celui de la directive [[13-directives/languagepriority|LanguagePriority]] du module [[12-modules/mod_negotiation|mod_negotiation]] en qualifiant un *type de média* avec `qs` :

**Exemple**

```apache
AddType application/rss+xml;qs=0.8 .xml
```

Ceci peut s'avérer utile dans certaines situations, par exemple lorsqu'un client qui a ajouté un en-tête `Accept: */*` à sa requête n'est pas en mesure de traiter le contenu renvoyé par le serveur.

A la base, cette directive configure le type de contenu généré pour les fichiers statiques servis à partir du système de fichiers. Dans le cas des ressources autres que les fichiers statiques pour lesquelles le générateur de la réponse spécifie en général un Content-Type, cette directive n'a aucun effet.

> [!NOTE]
> **Note**
>
> Si aucun gestionnaire n'a été explicitement défini pour une requête, c'est le type de contenu spécifié qui sera utilisé comme nom de gestionnaire.
>
> Lorsqu'aucune directive comme [[13-directives/sethandler|SetHandler]] ou [[13-directives/addhandler|AddHandler]] ne s'applique à une requête, le nom de gestionnaire interne qui aurait du être défini par une de ces directives correspond alors au type de contenu spécifié par la directive AddType.
>
> Pour des raisons historiques, certains modules tiers comme mod\_php peuvent adopter ce comportement pour forcer la prise en compte de la requête concernée.
>
> Il est conseillé d'éviter les configurations qui reposent sur de tels types "synthétiques". En outre, les configurations qui limitent l'accès aux directives [[13-directives/sethandler|SetHandler]] ou [[13-directives/addhandler|AddHandler]] doivent aussi limiter l'accès à la directive AddType.

## Voir aussi

- [[13-directives/forcetype|ForceType]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

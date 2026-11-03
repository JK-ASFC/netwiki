---
title: "SetOutputFilter"
description: "Directive Apache SetOutputFilter (core) — Définit les filtres par lesquels vont passer les réponses du serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit les filtres par lesquels vont passer les réponses du serveur |
| **Syntaxe** | `SetOutputFilter filtre[;filtre...]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `SetOutputFilter` permet de définir les filtres par lesquels vont passer les réponses du serveur avant d'être envoyées au client. Cette définition vient en ajout à tout autre filtre défini en quelqu'endroit que ce soit, y compris via la directive [[13-directives/addoutputfilter|AddOutputFilter]].

Par exemple, la configuration suivante va traiter tous les fichiers du répertoire `/www/data/` comme des inclusions côté serveur (SSI) :

```apache
<Directory "/www/data/">
  SetOutputFilter INCLUDES
</Directory>
```

Si la directive comporte plusieurs filtres, ils doivent être séparés par des points-virgules, et spécifiés selon l'ordre dans lequel vous souhaitez les voir agir sur les contenus.

## Voir aussi

- [[11-guides/01-generalites/filtres|Filters]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

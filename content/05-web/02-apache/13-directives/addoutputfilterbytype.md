---
title: "AddOutputFilterByType"
description: "Directive Apache AddOutputFilterByType (mod_filter) — assigne un filtre en sortie pour un type de média particulier. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_filter]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | assigne un filtre en sortie pour un type de média particulier |
| **Syntaxe** | `AddOutputFilterByType filtre[;filtre...] type_de_média [type_de_média] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_filter\|mod_filter]] |
| **Compatibilité** | Présentait de sévères limitations avant d'être déplacé dans [[12-modules/mod_filter\|mod_filter]] dans la version 2.3.7 |

## Utilisation

Cette directive active un [[11-guides/01-generalites/filtres|filtre]] en sortie particulier pour une requête en fonction du type de média de la réponse.

L'exemple suivant active le filtre `DEFLATE` qui est fourni par le module [[12-modules/mod_deflate|mod_deflate]]. Il va compresser toute sortie dont le type MIME est `text/html` ou `text/plain` avant de l'envoyer au client.

```apache
AddOutputFilterByType DEFLATE text/html text/plain
```

Si vous voulez assigner plusieurs filtres au contenu, leurs noms doivent être séparés par des points-virgules. On peut aussi utiliser une directive `AddOutputFilterByType` pour chacun des filtres à assigner.

La configuration ci-dessous impose le traitement de toute sortie de script dont le type MIME est `text/html` en premier lieu par le filtre `INCLUDES`, puis par le filtre `DEFLATE`.

```apache
<Location "/cgi-bin/">
    Options Includes
    AddOutputFilterByType INCLUDES;DEFLATE text/html
</Location>
```

Notez que les directives `AddOutputFilterByType` situées dans un même contexte sont additives, mais que leur définition dans un contexte plus spécifique (tel qu'une section [[13-directives/virtualhost|<VirtualHost>]], [[13-directives/directory|<Directory>]] ou [[13-directives/location|<Location>]]) remplacera — ne s'ajoutera pas à — toutes définitions héritées d'un contexte plus général. Ce comportement est identique à celui de la directive [[13-directives/addoutputfilter|AddOutputFilter]].

```apache
# Server context: compress text/html and text/plain
AddOutputFilterByType DEFLATE text/html text/plain
<VirtualHost *:80>
    # Remplace la définition globale pour ce serveur virtuel;
    # seuls les contenus de type text/css seront compressés ici :
    AddOutputFilterByType DEFLATE text/css
</VirtualHost>
```

> [!WARNING]
> **Limitation avec les filtres définis par l'utilisateur**
>
> La directive `AddOutputFilterByType` fonctionne avec des filtres intégrés standards comme `DEFLATE` et `INCLUDES`, mais ne fonctionne pas avec des filtres qui déterminent leur configuration par nom de filtre, comme ceux définis par le module [[12-modules/mod_ext_filter|mod_ext_filter]] ou par la directive `LuaOutputFilter` du module [[12-modules/mod_lua|mod_lua]]. Cela est dû au fait que le nom du filtre est modifié en interne par l'adjonction du préfixe `BYTYPE:`. Pour les filtres définis par l'utilisateur, utilisez à la place les directives `FilterDeclare` et `FilterProvider` avec une expression correspondant à `%{CONTENT_TYPE}`.

## Voir aussi

- [[13-directives/addoutputfilter|AddOutputFilter]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

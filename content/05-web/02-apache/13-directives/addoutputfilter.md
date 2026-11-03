---
title: "AddOutputFilter"
description: "Directive Apache AddOutputFilter (mod_mime) — Associe les extensions de noms de fichiers aux filtres spécifiés qui traiteront les réponses en provenance du serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Associe les extensions de noms de fichiers aux filtres spécifiés qui traiteront les réponses en provenance du serveur |
| **Syntaxe** | `AddOutputFilter filtre[;filtre...] extension [extension] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `AddOutputFilter` permet d'associer l'extension de nom de fichier définie par l'argument *extension* aux [[11-guides/01-generalites/filtres|filtres]] qui traiteront les réponses en provenance du serveur avant de les envoyer au client. Ces filtres s'ajoutent à tout filtre défini par d'autres directives comme [[13-directives/setoutputfilter|SetOutputFilter]] et [[13-directives/addoutputfilterbytype|AddOutputFilterByType]]. Cette association est fusionnée avec toute autre association en vigueur, et l'emporte sur toute association préexistante pour la même *extension*.

Avec l'exemple suivant, tous les fichiers `.shtml` seront traités en tant qu'inclusions côté serveur (SSI), et la sortie sera compressée à l'aide du module [[12-modules/mod_deflate|mod_deflate]].

```apache
AddOutputFilter INCLUDES;DEFLATE shtml
```

Si plusieurs *filtres* sont spécifiés, ils doivent être séparés par des points-virgules et inscrits dans l'ordre selon lequel il devront traiter le contenu. L'argument *filtre* est insensible à la casse.

L'argument *extension* est insensible à la casse et peut être spécifié avec ou sans le point initial. Les noms de fichiers peuvent posséder plusieurs extensions, et l'argument *extension* sera comparé à chacune d'entre elles.

Notez que toute définition de filtres via la directive [[13-directives/addoutputfilter|AddOutputFilter]] remplace toutes les définitions précédentes effectuées via cette même directive.

```apache
# Filtre spécifié "DEFLATE"
AddOutputFilter DEFLATE shtml
<Location "/foo">
  # Filtre spécifié "INCLUDES", remplace "DEFLATE"
  AddOutputFilter INCLUDES shtml
</Location>
<Location "/bar">
  # Filtre spécifié "INCLUDES;DEFLATE", remplace "DEFLATE"
  AddOutputFilter INCLUDES;DEFLATE shtml
</Location>
<Location "/bar/baz">
  # Filtre spécifié "BUFFER", remplace "INCLUDES;DEFLATE"
  AddOutputFilter BUFFER shtml
</Location>
<Location "/bar/baz/buz">
  # Pas de filtre spécifié, suppression de "BUFFER"
  RemoveOutputFilter shtml
</Location>
```

## Voir aussi

- [[13-directives/removeoutputfilter|RemoveOutputFilter]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

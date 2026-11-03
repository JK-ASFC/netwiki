---
title: "AddInputFilter"
description: "Directive Apache AddInputFilter (mod_mime) — Associe les extensions de noms de fichiers aux filtres spécifiés qui traiteront les requêtes clients. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Associe les extensions de noms de fichiers aux filtres spécifiés qui traiteront les requêtes clients |
| **Syntaxe** | `AddInputFilter filtre[;filtre...] extension [extension] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `AddInputFilter` permet d'associer l'extension de nom de fichier *extension* aux [[11-guides/01-generalites/filtres|filtres]] spécifiésqui traiteront les requêtes clients et les entrées POST à leur réception par le serveur. Ceci s'ajoute à toute définition de filtre préexistante, y compris la directive [[13-directives/setinputfilter|SetInputFilter]]. Cette association est ajoutée à toutes les autres déjà en vigueur, et écrase toute association préexistante pour la même *extension*.

Si plusieurs *filtres* sont spécifiés, ils doivent être séparés par des points-virgules et inscrits dans l'ordre selon lequel ils devront traiter le contenu. L'argument *filtre* est insensible à la casse.

L'argument *extension* est insensible à la casse et peut être spécifié avec ou sans le point initial. Les noms de fichiers peuvent posséder plusieurs extensions, et l'argument *extension* sera comparé à chacune d'entre elles.

## Voir aussi

- [[13-directives/removeinputfilter|RemoveInputFilter]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

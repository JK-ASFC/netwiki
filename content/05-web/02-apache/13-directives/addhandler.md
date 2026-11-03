---
title: "AddHandler"
description: "Directive Apache AddHandler (mod_mime) — Associe les extensions de noms de fichiers données au gestionnaire spécifié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Associe les extensions de noms de fichiers données au gestionnaire spécifié |
| **Syntaxe** | `AddHandler nom-gestionnaire extension [extension] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

Les fichiers dont le nom a pour extension *extension* seront servis par le *[[11-guides/01-generalites/utilisation-des-gestionnaires-d-apache-handlers|nom-gestionnaire]]* spécifié. Cette association est ajoutée à toutes les autres déjà en vigueur, et écrase toute association préexistante pour la même *extension*. Par exemple, pour associer les fichiers `.var` au gestionnaire `type-map` fourni par le module [[12-modules/mod_negotiation|mod_negotiation]], vous pouvez utiliser :

```apache
AddHandler type-map .var
```

L'argument *extension* est insensible à la casse et peut être spécifié avec ou sans le point initial. Les noms de fichiers peuvent posséder plusieurs extensions, et l'argument *extension* sera comparé à chacune d'entre elles.

## Voir aussi

- [[13-directives/sethandler|SetHandler]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

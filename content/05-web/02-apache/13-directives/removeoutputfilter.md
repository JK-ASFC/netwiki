---
title: "RemoveOutputFilter"
description: "Directive Apache RemoveOutputFilter (mod_mime) — Supprime toute association de filtre en sortie à un ensemble d'extensions de noms de fichiers. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Supprime toute association de filtre en sortie à un ensemble d'extensions de noms de fichiers |
| **Syntaxe** | `RemoveOutputFilter extension [extension] ...` |
| **Contexte** | serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `RemoveOutputFilter` permet de supprimer toute association de [[11-guides/01-generalites/filtres|filtre]] en sortie à des fichiers dont le nom possède l'extension donnée. Ceci permet, au sein des fichiers `.htaccess`, d'annuler toute association héritée du répertoire parent ou de la configuration du serveur pour un répertoire particulier.

L'argument *extension* est insensible à la casse et peut être spécifié avec ou sans le point initial.

**Exemple**

```apache
RemoveOutputFilter shtml
```

## Voir aussi

- [[13-directives/addoutputfilter|AddOutputFilter]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

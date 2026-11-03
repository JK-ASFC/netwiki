---
title: "IncludeOptional"
description: "Directive Apache IncludeOptional (core) — Inclusion de fichiers dans le fichier de configuration. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Inclusion de fichiers dans le fichier de configuration |
| **Syntaxe** | `IncludeOptional file-path\|directory-path\|wildcard` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.3.6 du serveur HTTP Apache. Après la version 2.4.30, les chemins de fichiers non existants et ne comportant pas de caractères génériques ne génèrent plus d'erreurs de syntaxe |

## Utilisation

Cette directive permet d'inclure des fichiers dans les fichiers de configuration du serveur. Elle fonctionne de manière identique à la directive [[13-directives/include|Include]], mais au lieu de générer une erreur, elle sera ignorée silensieusement si malgré l'utilisation de caractères génériques, le chemin de fichier ou de répertoire spécifié n'existe pas dans le système de fichiers.

## Voir aussi

- [[13-directives/include|Include]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

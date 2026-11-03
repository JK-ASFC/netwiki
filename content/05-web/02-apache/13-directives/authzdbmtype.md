---
title: "AuthzDBMType"
description: "Directive Apache AuthzDBMType (mod_authz_dbm) — Définit le type de fichier de base de données contenant la liste des groupes d'utilisateurs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_dbm]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le type de fichier de base de données contenant la liste des groupes d'utilisateurs |
| **Syntaxe** | `AuthzDBMType default\|SDBM\|GDBM\|NDBM\|DB` |
| **Valeur par défaut** | `AuthzDBMType default` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authz_dbm\|mod_authz_dbm]] |

## Utilisation

Définit le type de fichier de base de données contenant la liste des groupes d'utilisateurs. Le type de base de données par défaut est déterminé à la compilation. Les autres types de bases de données disponibles dépendent aussi de la [[11-guides/01-generalites/compilation-et-installation|configuration de la compilation]].

Quel que soit le programme que vous utilisez pour créer votre fichier de groupes, il est impératif que celui-ci soit configuré pour utiliser le même type de base de données.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

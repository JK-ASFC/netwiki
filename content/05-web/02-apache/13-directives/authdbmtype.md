---
title: "AuthDBMType"
description: "Directive Apache AuthDBMType (mod_authn_dbm) — Définit le type de fichier de base de données utilisé pour stocker les mots de passe. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_dbm]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le type de fichier de base de données utilisé pour stocker les mots de passe |
| **Syntaxe** | `AuthDBMType default\|SDBM\|GDBM\|NDBM\|DB` |
| **Valeur par défaut** | `AuthDBMType default` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authn_dbm\|mod_authn_dbm]] |

## Utilisation

Cette directive permet de définir le type de fichier de base de données utilisé pour stocker les mots de passe. Le type de base de données par défaut est défini à la compilation. La liste des autres types de bases de données disponibles dépend aussi de la [[10-commandes/configure|configuration de la compilation]].

Par exemple, pour activer le support de Berkeley DB (correspondant au type `db`), il faut ajouter l'option `--with-berkeley-db` à la ligne de commande configure de httpd pour générer le DSO approprié.

Il est impératif que le programme que vous utilisez pour créer vos fichiers de mots de passe soit configuré pour utiliser le même type de base de données.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

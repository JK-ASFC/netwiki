---
title: "IndexIgnore"
description: "Directive Apache IndexIgnore (mod_autoindex) — Ajouts à la liste des fichiers à cacher lors de l'affichage de l'index d'un répertoire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajouts à la liste des fichiers à cacher lors de l'affichage de l'index d'un répertoire |
| **Syntaxe** | `IndexIgnore fichier [fichier] ...` |
| **Valeur par défaut** | `IndexIgnore "."` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

La directive `IndexIgnore` permet d'effectuer des ajouts à la liste des fichiers à cacher lors de l'affichage de l'index d'un répertoire. *fichier* est un nom de fichier ou un motif qui peut contenir les caractères génériques `?` et `*`. `?` correspond à tout caractère unique et `*` à toute chaîne de caractères, y compris la chaîne vide. Des directives IndexIgnore multiples ajoutent des éléments à la liste des fichiers à ignorer au lieu de remplacer cette dernière. Par défaut, la liste contient `.` (le répertoire actuel).

```apache
IndexIgnore .??* *~ *# HEADER* README* RCS CVS *,v *,t
```

Si *fichier* contient un caractère `/`, seule la partie après le dernier `/` est utilisée pour la recherche de correspondance avec les noms de fichier. Par exemple, `*/.??*` est équivalent à `.??*`.

> [!NOTE]
> **Différences avec les motifs à caractères génériques du shell**
>
> La recherche de correspondance avec caractères génériques utilisée ici n'est *pas* la même que la recherche de correspondance de motifs de noms de fichier dans le style du shell (glob). En particulier :
>
> - Les expressions entre crochets telles que `[abc]` ou `[!.]` ne sont pas prises en charge ; elles sont traitées comme des caractères littéraux.
> - Un point en début de nom de fichier n'est pas traité de manière particulière. Par exemple, `*~` correspondra avec `.example~`, alors que ce ne sera pas le cas avec le shell.

> [!NOTE]
> **Expressions rationnelles**
>
> Cette directive est actuellement incompatible avec les sections de configuration qui comportent des arguments avec expressions rationnelles comme [[13-directives/directorymatch|<DirectoryMatch>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

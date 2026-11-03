---
title: "RemoveHandler"
description: "Directive Apache RemoveHandler (mod_mime) — Supprime toute association de gestionnaire à un ensemble d'extensions de noms de fichiers. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Supprime toute association de gestionnaire à un ensemble d'extensions de noms de fichiers |
| **Syntaxe** | `RemoveHandler extension [extension] ...` |
| **Contexte** | serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `RemoveHandler` permet de supprimer toute association de gestionnaire à des fichiers dont le nom possède l'extension donnée. Ceci permet, au sein des fichiers `.htaccess`, d'annuler toute association héritée du répertoire parent ou de la configuration du serveur pour un répertoire particulier. Voici un exemple d'utilisation de cette directive :

**/foo/.htaccess:**

```apache
AddHandler server-parsed .html
```

**/foo/bar/.htaccess:**

```apache
RemoveHandler .html
```

Avec cette dernière ligne, les fichiers `.html` du répertoire `/foo/bar` seront traités en tant que fichiers normaux, au lieu d'être traités en tant que candidats à l'interprétation (voir le module [[12-modules/mod_include|mod_include]] module).

L'argument *extension* est insensible à la casse et peut être spécifié avec ou sans le point initial.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

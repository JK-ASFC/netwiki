---
title: "RemoveEncoding"
description: "Directive Apache RemoveEncoding (mod_mime) — Supprime toute association de codage de contenu pour un ensemble d'extensions de noms de fichiers. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Supprime toute association de codage de contenu pour un ensemble d'extensions de noms de fichiers |
| **Syntaxe** | `RemoveEncoding extension [extension] ...` |
| **Contexte** | serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `RemoveEncoding` permet de supprimer toute association de codage pour les fichiers dont les noms possèdent les extensions spécifiées. Ceci permet, au sein des fichiers `.htaccess`, d'annuler toute association héritée du répertoire parent ou de la configuration du serveur pour un répertoire particulier. Voici un exemple d'utilisation de cette directive :

**/foo/.htaccess:**

```apache
AddEncoding x-gzip .gz
AddType text/plain .asc
<Files "*.gz.asc">
    RemoveEncoding .gz
</Files>
```

Avec cette configuration, le fichier `foo.gz` sera marqué comme codé avec gzip, mais `foo.gz.asc` sera marqué comme fichier texte non codé.

> [!NOTE]
> **Note**
>
> Les directives `RemoveEncoding` étant traitées *après* toute directive [[13-directives/addencoding|AddEncoding]], il est possible qu'elles annulent les effets de ces dernières si les deux apparaissent dans la configuration du même répertoire.

L'argument *extension* est insensible à la casse et peut être spécifié avec ou sans le point initial.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

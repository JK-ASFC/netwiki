---
title: "AllowOverrideList"
description: "Directive Apache AllowOverrideList (core) — Directives autorisées dans les fichiers .htaccess. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Directives autorisées dans les fichiers `.htaccess` |
| **Syntaxe** | `AllowOverrideList None\|directive [directive] ...` |
| **Valeur par défaut** | `AllowOverrideList None` |
| **Contexte** | répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Lorsque le serveur trouve un fichier `.htaccess` (comme spécifié par la directive [[13-directives/accessfilename|AccessFileName]]), il doit savoir lesquelles des directives déclarées dans ce fichier peuvent remplacer des directives des fichiers de configuration du serveur.

> [!NOTE]
> **Seulement disponible dans les sections \<Directory\>**
>
> La directive `AllowOverrideList` n'est disponible que dans les sections [[13-directives/directory|<Directory>]] spécifiées sans expressions rationnelles.

Lorsque cette directive et la directive [[13-directives/allowoverride|AllowOverride]] sont définies à `None`, les fichiers .htaccess sont totalement ignorés. Dans ce cas, le serveur ne cherchera même pas à lire des fichiers `.htaccess` dans le système de fichiers.

> [!NOTE]
> La valeur `None` ne peut pas être combinée avec d'autres valeurs. Si c'est le cas, une erreur sera produite qui interrompra la lecture de la configuration.

Example:

```apache
AllowOverride None
AllowOverrideList Redirect RedirectMatch
```

Dans l'exemple ci-dessus, seules les directives `Redirect` et `RedirectMatch` sont autorisées. Toutes les autres provoqueront une erreur interne du serveur.

Example:

```apache
AllowOverride AuthConfig
AllowOverrideList CookieTracking CookieName
```

Dans l'exemple ci-dessus, la directive [[13-directives/allowoverride|AllowOverride]] autorise les directives du groupement `AuthConfig`, et `AllowOverrideList` n'autorise que deux directives du groupement `FileInfo`. Le jeu de directives permises effectif est l’union des deux. Toutes les autres provoqueront une erreur interne du serveur.

En outre, certaines directives sont toujours permises dans les fichiers `.htaccess`, pourvu que le mécanisme d’outrepassement soit activé (c’est-à-dire que la directive [[13-directives/allowoverride|AllowOverride]] ne soit pas définie à `None`). Ces directives sont listées dans la section All de l’index de la classe override.

## Voir aussi

- [[13-directives/accessfilename|AccessFileName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

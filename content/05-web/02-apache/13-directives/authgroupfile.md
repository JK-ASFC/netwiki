---
title: "AuthGroupFile"
description: "Directive Apache AuthGroupFile (mod_authz_groupfile) — Définit le nom d'un fichier texte contenant la liste des groupes d'utilisateurs permettant de définir les autorisations des utilisateurs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_groupfile]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nom d'un fichier texte contenant la liste des groupes d'utilisateurs permettant de définir les autorisations des utilisateurs |
| **Syntaxe** | `AuthGroupFile chemin-fichier` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authz_groupfile\|mod_authz_groupfile]] |

## Utilisation

La directive `AuthGroupFile` permet de définir le nom d'un fichier texte contenant la liste des groupes d'utilisateurs. L'appartenance d'un utilisateur à tel ou tel groupe pourra dès lors être utilisée pour définir les permissions d'accès de l'utilisateur. *chemin-fichier* est le chemin du fichier de groupes. S'il n'est pas absolu, ce chemin est considéré comme relatif au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]].

Chaque ligne du fichier de groupes contient un nom de groupe suivi du caractère ':' et des noms des utilisateurs membres du groupe séparés par des espaces.

**Exemple :**

```
mon-groupe : bob joe anne
```

Notez que la recherche dans de grands fichiers textes est *très* inefficace ; la directive [[13-directives/authdbmgroupfile|AuthDBMGroupFile]] fournit de bien meilleures performances.

> [!WARNING]
> **Sécurité**
>
> Le fichier `AuthGroupFile` ne doit pas être stocké dans l'arborescence des documents du site web ; ne le placez *surtout pas* dans le répertoire qu'il protège, faute de quoi les clients pourraient le télécharger.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

---
title: "AuthDBMGroupFile"
description: "Directive Apache AuthDBMGroupFile (mod_authz_dbm) — Définit le nom du fichier de base de données contenant la liste des groupes d'utilisateurs permettant de définir les autorisations des utilisateurs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_dbm]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nom du fichier de base de données contenant la liste des groupes d'utilisateurs permettant de définir les autorisations des utilisateurs |
| **Syntaxe** | `AuthDBMGroupFile chemin-fichier` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authz_dbm\|mod_authz_dbm]] |

## Utilisation

La directive `AuthDBMGroupFile` sert à définir le nom d'un fichier DBM contenant la liste des groupes d'utilisateurs. Les utilisateurs peuvent dès lors se voir autoriser ou refuser leurs accès selon l'appartenance à tel ou tel groupe. *chemin-fichier* est le chemin absolu du fichier de groupes.

La clé du fichier de groupes est le nom d'utilisateur. La valeur de chaque clé est la liste des groupes, séparés par des virgules, auxquels l'utilisateur appartient. Cette liste ne doit comporter ni espace, ni caractère ':'.

> [!WARNING]
> **Sécurité**
>
> Le fichier spécifié par la directive `AuthDBMGroupFile` doit être situé en dehors de l'arborescence des documents du serveur web. Ne le placez **surtout pas** dans le répertoire qu'il protège, faute de quoi, les clients pourraient le télécharger, en l'abscence de protection supplémentaire.

Utilisation combinée de fichiers DBM de groupes et de mots de passe : dans certains cas, il est plus simple de gérer une seule base de données contenant les groupes et mots de passe de chaque utilisateur. L'écriture de programmes de support en est ainsi simplifiée car ils n'ont plus qu'un seul fichier DBM à gérer et à verrouiller. Pour ce faire, on attribue le même nom de fichier DBM aux fichiers de groupes et de mots de passe :

```apache
AuthDBMGroupFile "/www/userbase"
AuthDBMUserFile "/www/userbase"
```

La clé du fichier DBM unique est le nom d'utilisateur. La valeur associée à la clé contient :

```
Mot de passe chiffré : Liste de groupes [ : (ignoré) ]
```

La partie mot de passe contient comme d'habitude le mot de passe chiffré. Viennent ensuite le caractère ':' et la liste des groupes séparés par des virgules. Il est possible d'ajouter d'autres données en fin de ligne après un autre caractère ':', mais elles seront ignorées par le module d'autorisation. Il s'agit du format utilisé par www.telescope.org pour sa base de données combinée groupes et mots de passe.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

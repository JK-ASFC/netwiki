---
title: "AuthUserFile"
description: "Directive Apache AuthUserFile (mod_authn_file) — Définit le nom d'un fichier texte pour l'authentification contenant la liste des utilisateurs et de leurs mots de passe. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_file]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nom d'un fichier texte pour l'authentification contenant la liste des utilisateurs et de leurs mots de passe |
| **Syntaxe** | `AuthUserFile chemin-fichier` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authn_file\|mod_authn_file]] |

## Utilisation

La directive `AuthUserFile` permet de définir le nom d'un fichier texte pour l'authentification contenant la liste des utilisateurs et de leurs mots de passe. *chemin-fichier* est le chemin vers le fichier des utilisateurs. S'il n'est pas absolu, il est considéré comme relatif au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]].

Chaque ligne du fichier des utilisateurs se compose du nom de l'utilisateur, du caractère ':' et du mot de passe chiffré. Si le même identifiant utilisateur est référencé plusieurs fois, [[12-modules/mod_authn_file|mod_authn_file]] utilisera la première occurrence pour vérifier le mot de passe.

Le format du mot de passe chiffré dépend du frontal d'authentification utilisé (par exemple [[12-modules/mod_auth_basic|mod_auth_basic]] ou [[12-modules/mod_auth_digest|mod_auth_digest]]). Voir la documentation sur les [[11-guides/06-divers/formats-de-mots-de-passe|Formats de mots de passe]] pour plus de détails.

Pour [[12-modules/mod_auth_basic|mod_auth_basic]], utilisez le programme [[10-commandes/htpasswd|htpasswd]] fourni avec la distribution binaire, mais que vous trouverez aussi dans le répertoire `src/support` de l'arborescence des sources. Voir sa [[10-commandes/htpasswd|page de manuel]] pour plus de détails. En bref :

On crée un fichier de mots de passe `nom-fichier` avec `nom-utilisateur` comme identifiant initial. Le mot de passe correspondant sera alors demandé :

```
htpasswd -c nom-fichier nom-utilisateur
```

Pour ajouter ou modifier `nom-utilisateur2` dans le fichier de mots de passe `nom-fichier` :

```
htpasswd nom-fichier nom-utilisateur2
```

Noter qu'une recherche dans de grands fichiers texte peut être très longue ; dans ce cas, il vaut mieux utiliser les fichiers DBM avec la directive [[13-directives/authdbmuserfile|AuthDBMUserFile]].

Pour [[12-modules/mod_auth_digest|mod_auth_digest]], vous devez utiliser le programme [[10-commandes/htdigest|htdigest]]. Notez que vous ne pouvez pas mélanger des données utilisateur pour l'Authentification HTTP à base de condensé et des données pour l'Authentification de Base dans le même fichier.

> [!WARNING]
> **Sécurité**
>
> Assurez-vous que le fichier `AuthUserFile` soit bien stocké en dehors de l'arborescence des documents du serveur web. Ne placez **pas** ce fichier dans le répertoire qu'il protège. Dans le cas contraire, les clients seraient en mesure de télécharger le fichier des mots de passe.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

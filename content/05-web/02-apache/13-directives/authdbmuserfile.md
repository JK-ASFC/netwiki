---
title: "AuthDBMUserFile"
description: "Directive Apache AuthDBMUserFile (mod_authn_dbm) — Définit le nom d'un fichier de base de données pour l'authentification contenant la liste des utilisateurs et de leurs mots de passe. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_dbm]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nom d'un fichier de base de données pour l'authentification contenant la liste des utilisateurs et de leurs mots de passe |
| **Syntaxe** | `AuthDBMUserFile chemin-fichier` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authn_dbm\|mod_authn_dbm]] |

## Utilisation

La directive `AuthDBMUserFile` permet de définir le nom d'un fichier de base de données pour l'authentification contenant la liste des utilisateurs et de leurs mots de passe. *chemin-fichier* doit être un chemin absolu vers le fichier de base de données.

La clé du fichier de base de données est le nom de l'utilisateur. La valeur associée est le mot de passe chiffré, éventuellement suivi par un ':' et des données arbitraires. Ce ':' ainsi que les données arbitraires qui suivent seront ignorées par le serveur.

> [!WARNING]
> **Sécurité :**
>
> Faites en sorte que le fichier spécifié par la directive `AuthDBMUserFile` soit stocké en dehors de l'arborescence des documents du serveur web ; en particulier, ne l'enregistrez *pas* dans le répertoire qu'il protège, faute de quoi, les clients auraient la possibilité de télécharger le fichier des mots de passe.

Le format de mot de passe chiffré dépend du frontal d'authentification utilisé (par exemple [[12-modules/mod_auth_basic|mod_auth_basic]] ou [[12-modules/mod_auth_digest|mod_auth_digest]]). Voir la documentation sur les [[11-guides/06-divers/formats-de-mots-de-passe|Formats de mots de passe]] pour plus de détails.

Note importante concernant la compatibilité : l'implémentation de `dbmopen` dans les modules d'Apache lit la longueur de la chaîne correspondant aux données chiffrées dans la structure des données DBM, plutôt que de calculer cette longueur en se basant sur le caractère nul final. Certaines applications par contre, comme le serveur web Netscape, calculent cette longueur en se basant sur le caractère nul final ; par conséquent, si vous rencontrez des difficultés en échangeant des fichiers DBM entre plusieurs applications, le problème peut éventuellement s'expliquer par cette différence d'implémentation.

Un script perl nommé [[10-commandes/dbmmanage|dbmmanage]] est fourni avec Apache. On peut utiliser ce programme pour créer et mettre à jour les fichiers de mots de passe au format DBM que ce module utilise. Il existe également un autre outil pour gérer les fichiers DBM, inclus dans le programme [[10-commandes/htdbm|htdbm]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

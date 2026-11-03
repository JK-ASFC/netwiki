---
title: "htdigest"
description: "Commande htdigest d’Apache HTTP Server — htdigest - Gestion des fichiers d'utilisateurs pour l'authentification à base de condensés : syntaxe, options et exemples."
tags: [apache, commande, htdigest]
icon: terminal
---

*htdigest - Gestion des fichiers d'utilisateurs pour l'authentification à base de condensés*

[[10-commandes/htdigest|htdigest]] permet de créer et maintenir les fichiers textes dans lesquels sont stockés des noms d'utilisateurs, des domaines de protection (realms) et des mots de passe pour l'authentification à base de condensés des utilisateurs HTTP. L'accès aux ressources du serveur HTTP Apache peut être limité aux seuls utilisateurs enregistrés dans les fichiers créés par [[10-commandes/htdigest|htdigest]].

Cette page de manuel ne décrit que les arguments de la ligne de commande. Pour plus de détails à propos des directives nécessaires à la configuration de l'authentification à base de condensés dans [[10-commandes/httpd|httpd]], voir le manuel Apache qui est fourni avec la distribution et peut être consulté à [http://httpd.apache.org/](http://httpd.apache.org/).

## Syntaxe

`htdigest [ -c ] fichier-mots-de-passe realm nom-utilisateur`

## options

**`-c`**

Crée le fichier *fichier-mots-de-passe*. Si *fichier-mots-de-passe* existe déjà, il est tout d'abord supprimé.

**`fichier-mots-de-passe`**

Nom du fichier contenant les noms utilisateurs, realms et mots de passe. Si l'option `-c` est spécifiée, le fichier est créé s'il n'existe pas, ou supprimé et recréé s'il existe déjà.

**`realm`**

Le nom du domaine de protection auquel le nom d'utilisateur appartient. Voir la [RFC 2617](https://www.rfc-editor.org/rfc/rfc2617) pour plus de détails.

**`nom-utilisateur`**

Le nom d'utilisateur à créer ou mettre à jour dans le *fichier-mots-de-passe*. Si *nom-utilisateur* est absent de ce fichier, une nouvelle entrée est ajoutée. Si l'utilisateur existe déjà, le mot de passe est modifié.

## Considérations à propos de sécurité

En tant qu'exécutable setuid, ce programme n'est pas sûr. En conséquence, évitez de lui attribuer des permissions setuid.

## Fichiers

Le chemin du fichier d’authentification à base de condensés est spécifié en tant qu’argument de la ligne de commande et il peut être placé n’importe où dans le système de fichiers.

***fichier des mots de passe***

Le fichier plat contenant les noms des utilisateurs, les domaines de protection (realms) et les mots de passe hachés.

## Voir aussi

- [[10-commandes/httpd|httpd]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

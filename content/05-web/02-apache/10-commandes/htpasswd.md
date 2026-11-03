---
title: "htpasswd"
description: "Commande htpasswd d’Apache HTTP Server — htpasswd - Gestion des fichiers d'utilisateurs pour l'authentification de base : syntaxe, options et exemples."
tags: [apache, commande, htpasswd]
icon: terminal
---

*htpasswd - Gestion des fichiers d'utilisateurs pour l'authentification de base*

[[10-commandes/htpasswd|htpasswd]] permet de créer et de maintenir les fichiers textes où sont stockés les noms d'utilisateurs et mots de passe pour l'authentification de base des utilisateurs HTTP. Si [[10-commandes/htpasswd|htpasswd]] rencontre un problème d'accès à un fichier, que ce soit pour écrire dans le fichier de sortie, ou pour lire le fichier d'entrée dans le but de le mettre à jour, il renvoie un code d'erreur et n'effectue aucune modification.

Il est possible de limiter l'accès aux ressources du serveur HTTP Apache aux seuls utilisateurs présents dans les fichiers créés par [[10-commandes/htpasswd|htpasswd]]. Ce programme ne sait gérer les noms d'utilisateurs et mots de passe que s'ils sont stockés dans des fichiers textes. Il peut cependant hasher et afficher les mots de passe à des fins d'utilisation dans d'autres types de bases de données. Pour utiliser une base de données DBM, voir le programme [[10-commandes/dbmmanage|dbmmanage]] ou [[10-commandes/htdbm|htdbm]].

[[10-commandes/htpasswd|htpasswd]] hashe les mots de passe en utilisant soit bcrypt, une version de MD5 modifiée pour Apache, soit SHA1, soit la routine `crypt()` du système. Les hashes basés sur SHA-2 (SHA-256 et SHA-512) sont supportés pour `crypt()`. Les fichiers gérés par [[10-commandes/htpasswd|htpasswd]] peuvent contenir deux types de mots de passe ; certaines entrées peuvent contenir des mots de passe hashés en MD5 ou bcrypt, alors que d'autres entrées du même fichier contiendront des mots de passe hashés avec `crypt()`.

Cette page de manuel ne décrit que les arguments de la ligne de commande. Pour plus de détails à propos des directives nécessaires à la configuration de l'authentification des utilisateurs dans [[10-commandes/httpd|httpd]], voir le manuel Apache qui est fourni avec la distribution ou peut être consulté à [http://httpd.apache.org/](http://httpd.apache.org).

## Syntaxe

`htpasswd [ -c ] [ -i ] [ -m | -B | -2 | -5 | -d | -s | -p ] [ -r rounds ] [ -C cost ] [ -D ] [ -v ] fichier-mots-de-passe nom-utilisateur`

`htpasswd -b [ -c ] [ -m | -B | -2 | -5 | -d | -s | -p ] [ -r rounds ] [ -C cost ] [ -D ] [ -v ] fichier-mots-de-passe nom-utilisateur mot-de-passe`

`htpasswd -n [ -i ] [ -m | -B | -2 | -5 | -d | -s | -p ] [ -r rounds ] [ -C cost ] nom-utilisateur`

`htpasswd -nb [ -m | -B | -2 | -5 | -d | -s | -p ] [ -r rounds ] [ -C cost ] nom-utilisateur mot-de-passe`

## Options

**`-b`**

Utilise le mode batch ; c'est à dire, extrait le mot de passe de la ligne de commande au lieu de le demander à l'opérateur. Cette option doit être utilisée avec la plus grande prudence, car **le mot de passe est visible en clair** dans la ligne de commande. Pour utiliser un script, voir l'option `-i`. Disponible à partir de la version 2.4.4 du serveur HTTP Apache.

**`-i`**

Lit le mot de passe depuis stdin sans vérification (à utiliser dans les scripts).

**`-c`**

Crée le *fichier-mots-de-passe*. Si *fichier-mots-de-passe* existe déjà, il est réécrit et tronqué. Cette option ne peut pas être combinée avec l'option `-n`.

**`-n`**

Affiche le résultat du traitement sur la sortie standard au lieu de mettre à jour le fichier. Ceci peut s'avérer utile pour générer des enregistrements de mots de passe qu'Apache pourra utiliser à des fins d'inclusion dans des fichiers de données au format autre que texte. Cette option modifie la syntaxe de la ligne de commande, car l'argument *fichier-mots-de-passe* (en général le premier) est omis. Elle ne peut pas être combinée avec l'option `-c` option.

**`-m`**

Utilise le hashage MD5 pour les mots de passe. C'est le comportement par défaut (depuis la version 2.2.18).

**`-2`**

Utilise des hashes basés sur SHA-256 `crypt()` pour les mots de passe. Supporté par la plupart des plateformes de style Unix.

**`-5`**

Utilise des hashes basés sur SHA-512 `crypt()` pour les mots de passe. Supporté par la plupart des plateformes de style Unix.

**`-B`**

Utilise bcrypt pour hasher les mots de passe. c'est un algorythme de chiffrement actuellement considéré comme sûr.

**`-C`**

Ce drapeau n'est autorisé qu'en conjonction avec le drapeau `-B` (hashage bcrypt). Il permet de définir la durée de traitement pour l'algorytme bcrypt (plus elle est longue, meilleure sera la sécurité, mais inférieure la rapidité). La valeur par défaut est 5 et les valeurs autorisées vont de 4 à 17.

**`-r`**

Ce drapeau n'est autorisé qu'en combinaison avec un des drapeaux `-2` ou `-5`. Il permet de définir le nombre de passes de hash utilisées pour l'algorithme SHA-2 (plus ce nombre est élevé, plus la sécurité est élevée, mais plus les performances se dégradent ; la valeur par défaut est 5000).

**`-d`**

Utilise le hashage `crypt()` pour les mots de passe. Cette option n'est pas supportée par le serveur [[10-commandes/httpd|httpd]] sous Windows ou Netware. Cet algorithme limite la longueur des mots de passe à 8 caractères ; il est considéré comme **non sur** du point de vue des standards actuels. C'était l'algorithme par défaut jusqu'à la version 2.2.17.

**`-s`**

Utilise le hashage SHA-1 (160 bits) pour les mots de passe. Facilite la migration vers/depuis les serveurs Netscape qui utilisent le format LDAP Directory Interchange (ldif). Cet algorithme est considéré comme **non sur** du point de vue des standards actuels.

**`-p`**

Enregistre les mots de passe en clair. Bien que [[10-commandes/htpasswd|htpasswd]] supporte la création des mots de passe en clair sur toutes les plates-formes, le démon [[10-commandes/httpd|httpd]] n'accepte les mots de passe en clair que sous Windows et Netware.

**`-D`**

Supprime un utilisateur, sous réserve qu'il existe dans le fichier spécifié par htpasswd.

**`-v`**

Vérifie si le mot de passe fourni correspond au mot de passe de l'utilisateur enregistré dans le fichier de mots de passe spécifié. Disponible à partir de la version 2.4.5 du serveur HTTP Apache.

**`fichier-mots-de-passe`**

Le nom du fichier contenant les noms d'utilisateurs et mots de passe. Avec l'option `-c`, le fichier est créé s'il n'existe pas, ou réécrit et tronqué s'il existe déjà.

**`nom-utilisateur`**

Le nom d'utilisateur à créer ou mettre à jour dans le *fichier-mots-de-passe*. Si *nom-utilisateur* n'existe pas, une nouvelle entrée est ajoutée. Dans le cas contraire, le mot de passe est modifié.

**`mot-de-passe`**

Le mot de passe en clair et destiné à être hashé puis stocké dans le fichier. Cet argument ne s'utilise qu'avec l'option `-b`.

## Valeur renvoyée

[[10-commandes/htpasswd|htpasswd]] renvoie 0 ("true") si le nom d'utilisateur et le mot de passe ont été enregistrés ou mis à jour avec succès dans le *fichier-mots-de-passe*. [[10-commandes/htpasswd|htpasswd]] renvoie `1` s'il a rencontré un problème d'accès aux fichiers, `2` si la ligne de commande comportait une erreur de syntaxe, `3` si le mot de passe entré interactivement ne correspondait pas au nom d'utilisateur, `4` si l'opération a été interrompue, `5` si une valeur était trop longue (nom-utilisateur, nom-fichier, mot-de-passe, ou l'enregistrement résultant), `6` si le nom d'utilisateur contenait des caractères illégaux (voir la section Restrictions), et `7` si le fichier spécifié n'était pas un fichier de mots de passe valide.

## Exemples

```
htpasswd /usr/local/etc/apache/.utilisateurs-htpasswd jsmith
```

Ajoute ou modifie le mot de passe de l'utilisateur `jsmith`. Le mot de passe est demandé à l'opérateur. Le mot de passe sera hashé en utilisant l'algorithme MD5 modifié pour Apache. Si le fichier spécifié n'existe pas, [[10-commandes/htpasswd|htpasswd]] renverra un code d'erreur.

```
htpasswd -c /home/doe/public_html/.htpasswd jane
```

Crée un nouveau fichier de mots de passe et y enregistre une entrée pour l'utilisateur `jane`. Le mot de passe est demandé à l'opérateur. Si le fichier existe et ne peut être ni lu ni écrit, il n'est pas modifié et [[10-commandes/htpasswd|htpasswd]] affichera un message et renverra un code d'erreur.

```
htpasswd -db /usr/web/.htpasswd-tous jones Pwd4Steve
```

Chiffre le mot de passe spécifié dans la ligne de commande (`Pwd4Steve`) en utilisant l'algorithme `crypt()`, et le stocke dans le fichier spécifié.

## Considérations à propos de sécurité

Les fichiers de mots de passe Web comme ceux que gère [[10-commandes/htpasswd|htpasswd]] ne doivent *pas* être situés dans l'espace d'URI du serveur Web -- en d'autres termes, il ne doit pas être possible d'y accéder à partir d'un navigateur.

En tant qu'exécutable setuid, ce programme n'est pas sûr, et il ne faut par conséquent *pas* lui attribuer de permissions setuid.

L'utilisation de l'option `-b` est déconseillée, car avec elle, les mots de passe apparaissent en clair dans la ligne de commande.

Notez qu'avec l'algorithme `crypt()`, seuls les huit premiers caractères du mot de passe spécifié sont pris en compte. Si le mot de passe spécifié est plus long, les caractères supplémentaires sont ignorés.

Le format de hashage SHA-1 n'utilise pas d'amorçage aléatoire (salting) : à un mot de passe donné correspond une seule représentation hashée. Les formats `crypt()` et MD5 permutent la représentation en la préfixant par une chaîne d'amorce aléatoire, afin de rendre les attaques de mots de passe à base de dictionnaires plus difficiles.

Les algorithmes de chiffrement SHA-1 et `crypt()` sont considérés comme **non surs** du point de vue des standards actuels.

Les algorithmes de chiffrement SHA-2 (SHA-256 et SHA-512) sont supportés par la plupart des systèmes de style Unix modernes et respectent la spécification [https://www.akkadia.org/drepper/SHA-crypt.txt](https://www.akkadia.org/drepper/SHA-crypt.txt).

## Restrictions

Sur les plates-formes Windows, la taille des mots de passe hashés avec [[10-commandes/htpasswd|htpasswd]] est limitée à `255` caractères. Les mots de passe dont la taille est supérieure seront tronqués.

L'algorithme MD5 utilisé par [[10-commandes/htpasswd|htpasswd]] est spécifique à Apache ; les mots de passe hashés en utilisant cet algorithme seront inutilisables sur d'autres serveurs Web.

La taille des noms d'utilisateurs est limitée à `255` octets et ceux-ci ne doivent pas contenir de caractère `:`.

Le coût en performances de la génération de la valeur de hashage d'un mot de passe bcrypt augmente avec le nombre de passes spécifié par l'option `-C`. A partir de sa version `1.6.0`, la bibliothèque `apr-util` limite le nombre de passes à 17.

## Fichiers

Le chemin du fichier des mots de passe est spécifié en tant qu’argument de la ligne de commande et il peut correspondre à n’importe quel emplacement du système de fichiers.

***fichier des mots de passe***

Le fichier plat contenant les noms utilisateur et les mots de passe. Il peut contenir des lignes vides et des lignes de commentaire commençant par un (`#`).

## Voir aussi

- [[10-commandes/httpd|httpd]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

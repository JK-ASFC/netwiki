---
title: "htdbm"
description: "Commande htdbm d’Apache HTTP Server — htdbm - Manipuler des bases de données DBM de mots de passe : syntaxe, options et exemples."
tags: [apache, commande, htdbm]
icon: terminal
---

*htdbm - Manipuler des bases de données DBM de mots de passe*

[[10-commandes/htdbm|htdbm]] permet de manipuler des fichiers au format DBM ou sont stockés des nom d'utilisateurs et mots de passe à des fins d'authentification de base des utilisateurs HTTP via le module [[12-modules/mod_authn_dbm|mod_authn_dbm]]. Voir la documentation de [[10-commandes/dbmmanage|dbmmanage]] pour plus de détails à propos de ces fichiers DBM.

## Syntaxe

`htdbm [ -TDBTYPE ] [ -i ] [ -c ] [ -m | -B | -d | -s | -p ] [ -C cost ] [ -t ] [ -v ] nom-fichier nom-utilisateur`

`htdbm -b [ -TDBTYPE ] [ -c ] [ -m | -B | -d | -s | -p ] [ -C cost ] [ -t ] [ -v ] nom-fichier nom-utilisateur mot-de-passe`

`htdbm -n [ -i ] [ -c ] [ -m | -B | -d | -s | -p ] [ -C cost ] [ -t ] [ -v ] nom-utilisateur`

`htdbm -nb [ -c ] [ -m | -B | -d | -s | -p ] [ -C cost ] [ -t ] [ -v ] nom-utilisateur mot-de-passe`

`htdbm -v [ -TDBTYPE ] [ -i ] [ -c ] [ -m | -B | -d | -s | -p ] [ -C cost ] [ -t ] [ -v ] nom-fichier nom-utilisateur`

`htdbm -vb [ -TDBTYPE ] [ -c ] [ -m | -B | -d | -s | -p ] [ -C cost ] [ -t ] [ -v ] nom-fichier nom-utilisateur mot-de-passe`

`htdbm -x [ -TDBTYPE ] nom-fichier nom-utilisateur`

`htdbm -l [ -TDBTYPE ]`

## Options

**`-b`**

Utilise le mode batch ; en d'autres termes, le mot de passe est extrait de la ligne de commande au lieu d'être demandé à l'opérateur. Cette option doit être utilisée avec la plus grande prudence, car **le mot de passe est visible en clair** dans la ligne de commande. Pour utiliser un script, voir l'option `-i`.

**`-i`**

Lit le mot de passe depuis stdin sans vérification (à utiliser dans le cadre d'un script).

**`-c`**

Crée le *fichier-mots-de-passe*. Si *fichier-mots-de-passe* existe déjà, il est réécrit et tronqué. Cette option ne peut pas être combinée avec l'option `-n`.

**`-n`**

Affiche les résultats sur la sortie standard et ne met pas à jour la base de données. Cette option modifie la syntaxe de la ligne de commande, car l'argument *fichier-mots-de-passe* (en général le premier) est omis. Elle ne peut pas être combinée avec l'option `-c`.

**`-m`**

Utilise un hachage MD5 pour les mots de passe. Sous Windows et Netware, c'est l'option par défaut..

**`-B`**

Utilise l'algorythme de hachage bcrypt pour les mots de passe. C'est un algorythme actuellement considéré comme sûr.

**`-C`**

Ce drapeau n'est autorisé qu'en conjonction avec le drapeau `-B` (hachage bcrypt). Il permet de définir la durée de traitement pour l'algorythme de chiffrement bcrypt (plus elle est longue, plus la sécurité est élevée, mais la rapidité est diminuée d'autant) ; la valeur par défaut est 5, les valeurs valides vont de 4 à 31.

**`-d`**

Utilise un hachage `crypt()` pour les mots de passe. C'est l'option par défaut sur toutes les plates-formes, sauf Windows et Netware. Bien que [[10-commandes/htdbm|htdbm]] supporte ce chiffrement sur toutes les plates-formes, il n'est pas supporté par le serveur [[10-commandes/httpd|httpd]] sous Windows et Netware. Cet algorythme est considéré comme **non sûr** selon les standards actuels.

**`-s`**

Utilise le hachage SHA pour les mots de passe. Facilite la migration vers/depuis les serveurs Netscape qui utilisent le format LDAP Directory Interchange (ldif). Cet algorythme est considéré comme **non sûr** selon les standards actuels.

**`-p`**

Utilise des mots de passe au format texte en clair. Bien que [[10-commandes/htdbm|htdbm]] supporte ce format sur toutes les plates-formes, le démon [[10-commandes/httpd|httpd]] n'accepte les mots de passe au format texte en clair que sous Windows et Netware.

**`-l`**

Affiche chaque nom d'utilisateur de la base de données accompagné de son commentaire sur la sortie standard.

**`-v`**

Vérifie une association nom d'utilisateur/mot de passe. Le programme affichera un message indiquant si le mot de passe fourni est valide. Si le mot de passe n'est pas valide, le programme s'arrête et renvoie un code d'erreur 3.

**`-x`**

Supprime l'utilisateur. Si le nom d'utilisateur existe dans le fichier DBM spécifié, il sera supprimé.

**`-t`**

Interprète le dernier paramètre en tant que commentaire. Avec cette option, il est possible d'ajouter une chaîne supplémentaire à la fin de la ligne de commande ; le contenu de cette chaîne sera stocké dans la base de données dans le champ "Comment" associé au nom d'utilisateur spécifié.

**`nom-fichier`**

Le nom du fichier au format DBM en général sans l'extension `.db`, `.pag`, ou `.dir`. Avec l'option `-c`, le fichier DBM est mis à jour s'il existe ou créé dans le cas contraire.

**`nom-utilisateur`**

Le nom d'utilisateur à créer ou mettre à jour dans le *fichier-mots-de-passe*. Si *nom-utilisateur* n'existe pas dans ce fichier, une entrée est ajoutée. S'il existe, son mot de passe est modifié.

**`mot-de-passe`**

Le mot de passe en clair destiné à être haché et stocké dans le fichier DBM. Ne s'utilise qu'avec l'option `-b`.

**`-TDBTYPE`**

Type de fichier DBM (SDBM, GDBM, DB, ou "default").

## Bugs

Vous devez garder à l'esprit qu'il existe de nombreux formats de fichiers DBM différents, et que selon toute vraisemblance, des bibliothèques pour plus d'un format sont présentes sur votre système. Les trois exemples de base sont SDBM, NDBM, le projet GNU GDBM, et Berkeley/Sleepycat DB 2/3/4. Malheureusement, toutes ces bibliothèques utilisent des formats de fichiers différents, et vous devez vous assurer que le format de fichier utilisé par *nom-fichier* correspond au format attendu par [[10-commandes/htdbm|htdbm]]. Actuellement, [[10-commandes/htdbm|htdbm]] n'a aucun moyen de savoir à quel type de fichier DBM il a à faire. S'il est utilisé avec un format inapproprié, il ne renverra rien, ou pourra créer un fichier DBM différent avec un nom différent, ou au pire, va corrompre le fichier DBM si vous avez tenté de le modifier.

Vous pouvez utiliser le programme `file` fourni par la plupart des systèmes Unix pour déterminer le format d'un fichier DBM.

## Valeur renvoyée

[[10-commandes/htdbm|htdbm]] renvoie 0 ("true") si les nom d'utilisateur et mot de passe ont été créés ou mis à jour avec succès dans le fichier DBM. [[10-commandes/htdbm|htdbm]] renvoie `1` s'il a rencontré un problème d'accès aux fichiers, `2` si la ligne de commande comportait une erreur de syntaxe, `3` si le mot de passe a été fourni interactivement et s'il est invalide pour l'entrée considérée, `4` si l'opération a été interrompue, `5` si une valeur est trop longue (nom utilisateur, nom fichier, mot de passe, ou l'enregistrement après son élaboration), `6` si le nom d'utilisateur contient des caractères illégaux (voir la section Restrictions), et `7` si le fichier n'est pas un fichier de mots de passe DBM valide.

## Exemples

```
htdbm /usr/local/etc/apache/.utilisateurs-htdbm jsmith
```

Ajoute ou modifie le mot de passe de l'utilisateur `jsmith`. Le mot de passe est demandé à l'opérateur. Sous Windows, le mot de passe sera haché en utilisant l'algorithme MD5 Apache modifié ; dans les autres cas, c'est la routine `crypt()` du système qui sera utilisée. Si le fichier n'existe pas, [[10-commandes/htdbm|htdbm]] s'arrêtera et renverra une erreur.

```
htdbm -c /home/doe/public_html/.htdbm jane
```

Crée un nouveau fichier et y enregistre une entrée pour l'utilisateur `jane`. Le mot de passe est demandé à l'opérateur. Si le fichier existe et ne peut pas être lu, ou ne peut pas être écrit, il ne sera pas modifié et [[10-commandes/htdbm|htdbm]] affichera un message et renverra un code d'erreur.

```
htdbm -mb /usr/web/.htdbm-tous jones Pwd4Steve
```

Chiffre le mot de passe entré avec la ligne de commande (`Pwd4Steve`) à l'aide de l'algorithme MD5, et l'enregistre dans le fichier spécifié.

## Considérations à propos de sécurité

Les fichiers de mots de passe Web tels que ceux que gère [[10-commandes/htdbm|htdbm]] ne doivent *pas* être stockés dans l'espace d'URI du serveur Web -- en d'autres termes, il ne doit pas être possible d'y accéder à l'aide d'un navigateur.

L'utilisation de l'option `-b` est déconseillée, car lorsqu'il est utilisé, le mot de passe apparaît en clair sur la ligne de commande.

Notez que lorsque vous utilisez l'algorythme `crypt()`, seuls les 8 premiers caractères du mot de passe sont pris en compte. Si le mot de passe fourni est plus long, les caractères supplémentaires seront ignorés sans avertissement.

L'algorythme de hachage SHA ne permet pas de spécifier une valeur d'initialisation pour la génération de nombres aléatoires (salting) : un mot de passe donné ne possède ainsi qu'une seule représentation hachée. Les algorythmes `crypt()` et MD5 permettent quant à eux des représentations hachées multiples en acceptant comme paramètre une chaîne d'initialisation (salt), rendant les attaques à base de dictionnaires contre les mots de passe plus difficiles.

Les algorythmes SHA et `crypt()` sont considérés comme non sûrs selon les standards actuels.

## Restrictions

Sur la plate-forme Windows, les mots de passe hachés avec [[10-commandes/htdbm|htdbm]] ont une taille limitée à `255` caractères. Si le mot de passe fourni est plus long, il sera tronqué à 255 caractères.

L'algorithme MD5 utilisé par [[10-commandes/htdbm|htdbm]] est spécifique à Apache ; les mots de passe hachés en utilisant cet algorithme seront inutilisables sur d'autres serveurs Web.

Les noms d'utilisateurs ont une taille limitée à `255` octets et ne doivent pas contenir de caractère `:`.

## Fichiers

Le chemin du fichier de mots de passe DBM est spécifié en tant qu’argument de la ligne de commande et peut correspondre à n’importe quel emplacement du système de fichiers.

***nom-fichier***

Le fichier au format DBM contenant les noms d’utilisateur et les mots de passe.

## Voir aussi

- [[10-commandes/httpd|httpd]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

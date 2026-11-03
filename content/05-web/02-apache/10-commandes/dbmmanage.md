---
title: "dbmmanage"
description: "Commande dbmmanage d’Apache HTTP Server — dbmmanage - Gestion des fichiers d'authentification des utilisateurs au format DBM : syntaxe, options et exemples."
tags: [apache, commande, dbmmanage]
icon: terminal
---

*dbmmanage - Gestion des fichiers d'authentification des utilisateurs au format DBM*

`dbmmanage` permet de créer et de maintenir les fichiers au format DBM où sont stockés les noms d'utilisateurs et mots de passe à des fins d'authentification de base des utilisateurs HTTP via le module [[12-modules/mod_authn_dbm|mod_authn_dbm]]. Il est possible de restreindre l'accès aux ressources disponibles sur le serveur HTTP Apache aux seuls utilisateurs spécifiés dans les fichiers créés par `dbmmanage`. Ce programme ne peut être utilisé qu'avec des fichiers d'utilisateurs au format DBM. Pour l'utilisation de fichiers textes, voir le programme [[10-commandes/htpasswd|htpasswd]].

Le programme [[10-commandes/htdbm|htdbm]] est aussi un utilitaire permettant de maintenir une base de données de mots de passe DBM.

Cette page de manuel ne décrit que les arguments de la ligne de commande. Pour plus de détails à propos des directives nécessaires pour configurer l'authentification des utilisateurs dans [[10-commandes/httpd|httpd]], voir le manuel httpd qui est fourni avec la distribution d'Apache, ou peut être consulté à [http://httpd.apache.org/](http://httpd.apache.org/).

## Syntaxe

`dbmmanage [ codage ] nom-fichier add|adduser|check|delete|update nom-utilisateur [ mot-de-passe-haché [ groupe[,groupe...] [ commentaire ] ] ]`

`dbmmanage nom-fichier view [ nom-utilisateur ]`

`dbmmanage nom-fichierimport`

## Options

**`nom-fichier`**

Le nom du fichier au format DBM, en général sans l'extension `.db`, `.pag`, ou `.dir`.

**`nom-utilisateur`**

L'utilisateur concerné par l'opération effectuée. Le *nom-utilisateur* ne doit pas contenir de caractère `:`.

**`mot-de-passe-haché`**

C'est le mot de passe sous sa forme hachée à utiliser avec les commandes `update` et `add`. Vous pouvez utiliser un tiret (`-`) si vous voulez que le mot de passe vous soit demandé, mais remplissez les champs par la suite. En outre, avec la commande `update`, un point (`.`) permet de conserver le mot de passe original.

**`groupe`**

Un groupe dont l'utilisateur est membre. Un nom de groupe ne doit pas contenir de caractère (`:`). Vous pouvez utiliser un tiret (`-`) si vous ne voulez pas associer l'utilisateur à un groupe, mais remplissez le champ commentaire. En outre, avec la commande `update`, un point (`.`) permet de conserver le groupe original.

**`commentaire`**

C'est l'endroit où vous pouvez enregistrer diverses informations à propos de l'utilisateur telles que son nom réel, sont e-mail, etc... Le serveur ignore ce champ.

### Codages

**`-d`**

hachage crypt (hachage par défaut sauf sous Win32, Netware)

**`-m`**

hachage MD5 (hachage par défaut sous Win32, Netware)

**`-s`**

hachage SHA1

**`-p`**

en clair (*déconseillé*)

### Commandes

**`add`**

Ajoute une entrée pour *nom-utilisateur* à *nom-fichier* en utilisant le mot de passe haché *mot-de-passe-haché*.

```
dbmmanage passwords.dat add rbowen foKntnEF3KSXA
```

**`adduser`**

Demande un mot de passe puis ajoute une entrée pour *nom-utilisateur* à *nom-fichier*.

```
dbmmanage passwords.dat adduser krietz
```

**`check`**

Demande un mot de passe puis vérifie si *nom-utilisateur* est présent dans *nom-fichier* et si son mot de passe correspond au mot de passe fourni.

```
dbmmanage passwords.dat check rbowen
```

**`delete`**

Supprime l'entrée *nom-utilisateur* de *nom-fichier*.

```
dbmmanage passwords.dat delete rbowen
```

**`import`**

Lit les entrées `nom-utilisateur:mot-de-passe` (une par ligne) depuis `STDIN`, et les ajoute à *nom-fichier*. Les mots de passe doivent être déjà chiffrés.

**`update`**

Identique à la commande `adduser`, à l'exception que la présence de *nom-utilisateur* dans *nom-fichier* est vérifiée.

```
dbmmanage passwords.dat update rbowen
```

**`view`**

Affiche le contenu du fichier DBM. Si vous spécifiez un *nom-utilisateur*, seule l'entrée correspondante est affichée.

```
dbmmanage passwords.dat view
```

## Bogues

Vous devez garder à l'esprit qu'il existe de nombreux formats de fichiers DBM différents, et que selon toute vraisemblance, des bibliothèques pour plus d'un format sont présentes sur votre système. Les trois exemples de base sont SDBM, NDBM, le projet GNU GDBM, et Berkeley DB 2. Malheureusement, toutes ces bibliothèques utilisent des formats de fichiers différents, et vous devez vous assurer que le format de fichier utilisé par *nom-fichier* correspond au format attendu par `dbmmanage`. Actuellement, `dbmmanage` n'a aucun moyen de savoir à quel type de fichier DBM il a à faire. S'il est utilisé avec un format inapproprié, il ne renverra rien, ou pourra créer un fichier DBM différent avec un nom différent, ou au pire, va corrompre le fichier DBM si vous avez tenté de le modifier.

`dbmmanage` possède une liste de préférences en matière de formats DBM, définies dans le tableau `@AnyDBM::ISA` au début du programme. Comme nous préférons le format de fichier Berkeley DB 2, l'ordre dans lequel `dbmmanage` va rechercher les bibliothèques système est Berkeley DB 2, puis NDBM, GDBM et enfin SDBM. La première bibliothèque trouvée sera celle que `dbmmanage` tentera d'utiliser pour toutes les opérations sur les fichiers DBM. Cette ordre est sensiblement différent de l'ordre standard de Perl `@AnyDBM::ISA`, et de l'ordre utilisé par l'appel `dbmopen()` de Perl ; si vous utilisez un autre utilitaire pour gérer vos fichiers DBM, il doit donc se conformer à l'ordre de préférence indiqué précédemment. Vous devez prêter la même attention si vous utilisez des programmes écrits dans d'autres langages, comme C, pour accéder à ces fichiers.

Vous pouvez utiliser le programme `file` fourni par la plupart des systèmes Unix pour déterminer le format d'un fichier DBM.

## Voir aussi

- [[10-commandes/httpd|httpd]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

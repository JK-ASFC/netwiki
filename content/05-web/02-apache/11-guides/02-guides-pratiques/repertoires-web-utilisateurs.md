---
title: "Répertoires web utilisateurs"
description: "Apache HTTP Server — Répertoires web utilisateurs. Sur les systèmes multi-utilisateurs, on peut permettre à chaque utilisateur d'avoir un site web dans son répertoire home à l'aide de la directive UserDir. Les visiteurs de l'URL http://example.com/~nom_utilisateur/ recevront un contenu situ"
tags: [apache, guide]
icon: book-open
---

Sur les systèmes multi-utilisateurs, on peut permettre à chaque utilisateur d'avoir un site web dans son répertoire home à l'aide de la directive [[13-directives/userdir|UserDir]]. Les visiteurs de l'URL `http://example.com/~nom_utilisateur/` recevront un contenu situé dans le répertoire home de l'utilisateur "`nom_utilisateur`", et dans le sous-répertoire spécifié par la directive [[13-directives/userdir|UserDir]].

Par défaut, l'accès à ces répertoires n'est **pas** permis. Vous pouvez en permettre l'accès à l'aide de la directive [[13-directives/userdir|UserDir]] en décommentant la ligne :

```apache
#Include conf/extra/httpd-userdir.conf
```

dans le fichier de configuration par défaut `conf/httpd.conf`, et en adaptant le fichier `httpd-userdir.conf` selon vos besoins, ou en incluant les directives appropriées dans une section [[13-directives/directory|<Directory>]] du fichier de configuration principal.

> [!NOTE]
> Les distributions tierces de httpd (fournies par le fabricant de votre OS ou par le gestionnaire de paquets) placent souvent la configuration de [[12-modules/mod_userdir|mod_userdir]] dans un fichier séparé, et peuvent l’activer par défaut. Consultez la documentation de votre distribution pour les spécificités. Les exemples de ce document présupposent une construction par défaut à partir des sources de httpd.

## Répertoires web utilisateurs

- [[12-modules/mod_userdir|mod_userdir]]
- [[13-directives/userdir|UserDir]]
- [[13-directives/directorymatch|<DirectoryMatch>]]
- [[13-directives/allowoverride|AllowOverride]]

## Définition du chemin des fichiers avec UserDir

La directive [[13-directives/userdir|UserDir]] permet de spécifier un répertoire à partir duquel le contenu de l'utilisateur pourra être chargé. Elle peut revêtir plusieurs formes.

Si le chemin spécifié ne commence pas par un slash, il sera interprété comme chemin relatif au répertoire home de l'utilisateur considéré. Par exemple, avec cette configuration :

```apache
UserDir public_html
```

l'URL `http://example.com/~rbowen/fichier.html` correspondra au chemin fichier `/home/rbowen/public_html/fichier.html`

Si le chemin spécifié commence par un slash, le chemin du fichier sera construit en utilisant ce chemin, suivi du nom de l'utilisateur considéré. Par exemple, avec cette configuration :

```apache
UserDir /var/html
```

l'URL `http://example.com/~rbowen/fichier.html` correspondra au chemin fichier `/var/html/rbowen/fichier.html`

Si le chemin spécifié contient un astérisque (\*), ce dernier sera remplacé par le nom de l'utilisateur dans le chemin du fichier correspondant. Par exemple, avec cette configuration :

```apache
UserDir /var/www/*/docs
```

l'URL `http://example.com/~rbowen/fichier.html` correspondra au chemin fichier `/var/www/rbowen/docs/fichier.html`

On peut aussi définir plusieurs répertoires ou chemins de répertoires.

```apache
UserDir public_html /var/html
```

Les arguments sont pris en compte selon l’ordre dans lequel ils apparaissent. Pour l’URL `http://example.com/~rbowen/file.html`, httpd recherchera d’abord `~rbowen`. Si ce dernier n’est pas trouvé, httpd cherchera `rbowen` dans `/var/html`. Le fichier sera servi depuis le premier emplacement trouvé.

## Redirection vers des URLs externes

On peut utiliser la directive [[13-directives/userdir|UserDir]] pour rediriger les requêtes relatives aux répertoires utilisateurs vers des URLs externes.

```apache
UserDir http://example.org/users/*/
```

L'exemple ci-dessus va rediriger une requête pour `http://example.com/~bob/abc.html` vers `http://exemple.org/users/bob/abc.html`.

## Définition de la liste des utilisateurs autorisés à utiliser cette fonctionnalité

En suivant la syntaxe décrite dans la documentation de UserDir, vous pouvez définir quels utilisateurs sont autorisés à utiliser cette fonctionnalité :

```apache
UserDir disabled root jro fish
```

La configuration ci-dessus va autoriser l'utilisation de la fonctionnalité pour tous les utilisateurs, à l'exception de ceux listés à la suite de l'argument `disabled`. De même, vous pouvez interdire l'utilisation de la fonctionnalité à tous les utilisateurs sauf certains d'entre eux en utilisant une configuration du style :

```apache
UserDir disabled
UserDir enabled rbowen krietz
```

Vous trouverez d'autres exemples dans la documentation de [[13-directives/userdir|UserDir]].

## Définition d'un répertoire CGI pour chaque utilisateur

Afin de réserver un répertoire cgi-bin pour chaque utilisateur, vous pouvez utiliser une section [[13-directives/directory|<Directory>]] pour activer CGI dans un sous-répertoire particulier d'un répertoire home utilisateur.

```apache
<Directory "/home/*/public_html/cgi-bin/">
Options ExecCGI
SetHandler cgi-script
</Directory>
```

Avec la configuration ci-dessus, et en supposant que `UserDir` est défini à `public_html`, un programme CGI `exemple.cgi` pourra être chargé depuis ce répertoire en passant par l'URL :

```
http://example.com/~rbowen/cgi-bin/exemple.cgi
```

## Permettre aux utilisateurs de modifier la configuration

Si vous voulez que vos utilisateurs puissent modifier la configuration du serveur pour ce qui concerne leur espace web, ils devront utiliser des fichiers `.htaccess` pour effectuer ces modifications. Assurez-vous d'avoir défini la directive [[13-directives/allowoverride|AllowOverride]] à une valeur appropriée pour les directives dont vous voulez permettre la modification aux utilisateurs. Voir le [[11-guides/02-guides-pratiques/tutoriel-du-serveur-http-apache-fichiers-htaccess|tutoriel .htaccess]] pour plus de détails sur la manière dont tout ceci fonctionne.

## Voir aussi

- [[11-guides/01-generalites/mise-en-correspondance-des-urls-avec-le-systeme-de-fichiers|Mise en correspondance des URLs avec le système de fichiers]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

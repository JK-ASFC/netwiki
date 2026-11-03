---
title: "mod_info"
description: "Module Apache mod_info — Affiche une présentation complète de la configuration du serveur. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_info]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Affiche une présentation complète de la configuration du serveur |
| **Statut** | Extension |
| **Identificateur** | `info_module` |
| **Fichier source** | `mod_info.c` |

## Sommaire

Pour activer [[12-modules/mod_info|mod_info]], ajoutez les lignes suivantes à votre fichier `httpd.conf`.

```apache
<Location "/server-info">
    SetHandler server-info
</Location>
```

Il est recommandé d'utiliser [[12-modules/mod_authz_host|mod_authz_host]] à l'intérieur de la section [[13-directives/location|<Location>]] afin de restreindre l'accès aux informations de configuration de votre serveur :

```apache
<Location "/server-info">
    SetHandler server-info
    Require host example.com
</Location>
```

Une fois cette configuration effectuée, les informations du serveur sont disponibles à l'adresse `http://votre-serveur.com/infos-serveur`.

## Problèmes liés à la sécurité

Une fois [[12-modules/mod_info|mod_info]] chargé dans le serveur, sa fonctionnalité de gestionnaire est disponible dans *tous* les fichiers de configuration, y compris les fichiers de configuration des répertoires (par exemple `.htaccess`). Ceci peut avoir des répercutions en matière de sécurité pour votre site.

En particulier, l'utilisation de ce module peut conduire à la divulgation d'informations sensibles à partir des directives de configuration d'autres modules Apache comme des chemins systèmes, des couples nom d'utilisateur/mot de passe, des noms de bases de données, etc... C'est pourquoi ce module ne doit être utilisé **que** dans un environnement sous contrôle et toujours avec les plus grandes précautions.

Il est recommandé d'utiliser [[12-modules/mod_authz_host|mod_authz_host]] pour restreindre l'accès aux informations de configuration de votre serveur.

**Contrôle d'accès**

```apache
<Location "/server-info">
    SetHandler server-info
    # Autorisation d'accès depuis le serveur lui-même
    Require ip 127.0.0.1

    # Autorisation d'accès depuis une station de travail du réseau
# local
    Require ip 192.168.1.17
</Location>
```

## Filtrage des informations affichées

Par défaut, les informations affichées comprennent une liste de tous les modules activés, et pour chaque module, une description des directives qu'il accepte, les branchements (hooks) qu'il implémente, ainsi que les directives concernées dans la configuration courante.

Il est possible d'afficher d'autres vues de la configuration en ajoutant un argument à la requête `infos-serveur`. Par exemple, `http://votre-serveur.com/infos-serveur?config` affichera toutes les directives de configuration.

**`?<module-name>`**

Uniquement les informations relatives au module spécifié

**`?config`**

Uniquement les directives de configuration, non triées par module

**`?hooks`**

Uniquement la liste des branchements (hooks) auxquels le module est attaché

**`?list`**

Une simple liste des modules activés

**`?server`**

Uniquement des informations de base sur le serveur

**`?providers`**

Liste des fournisseurs disponibles sur votre serveur

## Affichage de la configuration au démarrage

Si la directive de configuration define `-DDUMP_CONFIG` est utilisée, [[12-modules/mod_info|mod_info]] va envoyer la configuration préinterprétée vers `stdout` au cours du démarrage du serveur.

```bash
httpd -DDUMP_CONFIG -k start
```

"Préinterprétée" signifie que les directives telles que [[13-directives/ifdefine|<IfDefine>]] et [[13-directives/ifmodule|<IfModule>]] sont évaluées et les variables d'environnement remplacées par leurs valeurs. Cela ne représente cependant pas la configuration définitive. En particulier, les fusions ou écrasementsde définitions en cas de directives multiples ne sont pas représentés.

Le résultat est équivalent à celui de la requête `?config`.

## Limitations connues

[[12-modules/mod_info|mod_info]] tire ses informations de la configuration interprétée, et non du fichier de configuration original. La manière dont l'arbre de configuration interprété est créé induit quelques limitations :

- Les directives qui sont traitées immédiatement sans être enregistrées dans l'arbre de configuration interprété ne sont pas prises en compte. Celles-ci comprennent [[13-directives/serverroot|ServerRoot]], [[13-directives/loadmodule|LoadModule]] et [[13-directives/loadfile|LoadFile]].
- Les directives qui contrôlent le fichier de configuration lui-même, comme [[13-directives/include|Include]], [[13-directives/ifmodule|<IfModule>]] et [[13-directives/ifdefine|<IfDefine>]] ne sont pas prises en compte, mais les directives de configuration incluses le sont.
- Les commentaires ne sont pas pris en compte (Ce qui peut être considéré comme une fonctionnalité).
- Les directives de configuration des fichiers `.htaccess` ne sont pas prises en compte (car elles ne font pas partie de la configuration permanente du serveur).
- Les directives de conteneur comme [[13-directives/directory|<Directory>]] sont affichées normalement, mais [[12-modules/mod_info|mod_info]] est incapable de déterminer le numéro de ligne de la balise fermante `</Directory>`.
- Les directives générées par des modules tiers comme [mod\_perl](http://perl.apache.org) peuvent ne pas être prises en compte.

## Directives

- [[13-directives/addmoduleinfo|AddModuleInfo]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

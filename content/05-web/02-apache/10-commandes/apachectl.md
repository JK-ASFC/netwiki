---
title: "apachectl"
description: "Commande apachectl d’Apache HTTP Server — apachectl - L'interface de contrôle du serveur HTTP Apache : syntaxe, options et exemples."
tags: [apache, commande, apachectl]
icon: terminal
---

*apachectl - L'interface de contrôle du serveur HTTP Apache*

[[10-commandes/apachectl|apachectl]] est un frontal pour le serveur HTTP Apache. Il a été conçu pour aider l'administrateur à contrôler le fonctionnement du démon Apache [[10-commandes/httpd|httpd]].

Le script [[10-commandes/apachectl|apachectl]] possède deux modes de fonctionnement. Il peut fonctionner en tant que simple frontal de la commande [[10-commandes/httpd|httpd]] et ne fait alors que définir toute variable d'environnement nécessaire, puis invoque [[10-commandes/httpd|httpd]] en lui passant tout argument de ligne de commande souhaité. Il peut aussi fonctionner en tant que script d'initialisation SysV n'acceptant qu'un seul argument tel que `start`, `restart` et `stop`, et traduisant ce dernier en signaux appropriés pour le démon [[10-commandes/httpd|httpd]].

Si votre installation d'Apache utilise des chemins non standards, vous devrez éditer le script [[10-commandes/apachectl|apachectl]] afin de définir les chemins appropriés pour le binaire [[10-commandes/httpd|httpd]]. Vous pouvez aussi spécifier tout argument de ligne de commande de [[10-commandes/httpd|httpd]] nécessaire. Voir les commentaires dans le script pour plus de détails.

Le script [[10-commandes/apachectl|apachectl]] renvoie une valeur égale à 0 en cas de succès, et une valeur supérieure à 0 en cas de problème. Voir les commentaires dans le script pour plus de détails.

## Résumé

En mode frontal (pass-through), [[10-commandes/apachectl|apachectl]] peut spécifier tous les arguments qu'accepte le binaire [[10-commandes/httpd|httpd]].

`apachectl [ argument-httpd ]`

En mode script d'initialisation SysV, [[10-commandes/apachectl|apachectl]] n'accepte qu'un seul des arguments définis ci-dessous.

`apachectl commande`

## Options

Seules les options du style initialisation SysV sont décrites ici. Les autres arguments sont décrits dans la page de manuel de [[10-commandes/httpd|httpd]].

**`start`**

Démarre le démon Apache [[10-commandes/httpd|httpd]]. Renvoie une erreur s'il est déjà en cours d'exécution. Équivalent à `apachectl -k start`.

**`stop`**

Arrête le démon Apache [[10-commandes/httpd|httpd]]. Équivalent à `apachectl -k stop`.

**`restart`**

Redémarre le démon Apache [[10-commandes/httpd|httpd]]. Si le démon n'est pas en cours d'exécution, il est démarré. Cette option vérifie automatiquement les fichiers de configuration (de la même manière que l'option `configtest` ) avant de lancer le redémarrage, afin d'être sûr que le fonctionnement du démon ne sera pas compromis. Equivalent à `apachectl -k restart`.

**`fullstatus`**

Affiche le rapport d'état complet du module [[12-modules/mod_status|mod_status]]. Pour que ceci fonctionne, [[12-modules/mod_status|mod_status]] doit être activé dans votre serveur et vous devez disposer d'un navigateur en mode texte tel que `lynx` sur votre système. L'URL utilisée pour accéder au rapport d'état peut être modifiée en définissant la variable `STATUSURL` dans le script.

**`status`**

Affiche un rapport d'état succinct. Similaire à l'option `fullstatus`, excepté que la liste des requêtes en cours de traitement est omise.

**`graceful`**

Redémarre le démon Apache [[10-commandes/httpd|httpd]] en douceur. Si le démon n'est pas en cours d'exécution, il est démarré. À la différence d'un redémarrage normal, les connexions en cours ne sont pas fermées. Comme effet de bord, les anciens fichiers journaux ne seront pas fermés immédiatement. Cela signifie que si l'on utilise un script de rotation des journaux, un délai suffisant sera nécessaire afin d'être sûr que les fichiers journaux seront bien fermés avant leur traitement par le script de rotation. Cette option vérifie automatiquement les fichiers de configuration (de la même manière que l'option `configtest` ) avant de lancer le redémarrage, afin d'être sûr que le fonctionnement du démon ne sera pas compromis. Équivalent à `apachectl -k graceful`.

**`graceful-stop`**

Arrête le démon Apache [[10-commandes/httpd|httpd]] en douceur. À la différence d'un arrêt normal, les connexions en cours ne sont pas fermées. Comme effet de bord, les anciens fichiers journaux ne seront pas fermés immédiatement. Équivalent à `apachectl -k graceful-stop`.

**`configtest`**

Effectue une vérification de la syntaxe du fichier de configuration. Avec cette option, le script parcourt le fichier de configuration et renvoie soit `Syntax Ok`, soit des informations détaillées à propos des éventuelles erreurs de syntaxe. Equivalent à `apachectl -t`.

Les options suivantes étaient disponibles dans les anciennes versions et ont été supprimées.

**`startssl`**

Pour démarrer [[10-commandes/httpd|httpd]] avec le support SSL, vous devez éditer votre fichier de configuration et y inclure les directives appropriées, puis utiliser la commande de démarrage normale `apachectl start`.

## Fichiers

Les chemins de fichiers listés ci-après peuvent être modifiés à la compilation. Consultez votre installation locale pour les emplacements réels.

**`/usr/local/apache2/bin/envvars`**

Fichier de définitions de variables d’environnement alimenté au démarrage.

**`/usr/local/apache2/bin/httpd`**

Le binaire httpd invoqué par apachectl.

## Voir aussi

- [[11-guides/01-generalites/demarrage-d-apache|Démarrer Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

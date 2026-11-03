---
title: "Démarrage d'Apache"
description: "Apache HTTP Server — Démarrage d'Apache. Sous Windows, Apache est habituellement lancé en tant que service. Pour plus de détails, voir Démarrer Apache en tant que service. Sous Unix, le programme httpd est lancé en mode démon et s'exécute de manière permanente en arrière-plan pour"
tags: [apache, guide]
icon: book-open
---

Sous Windows, Apache est habituellement lancé en tant que service. Pour plus de détails, voir [[11-guides/07-plates-formes/utilisation-du-serveur-http-apache-sous-microsoft-windows|Démarrer Apache en tant que service]].

Sous Unix, le programme [[10-commandes/httpd|httpd]] est lancé en mode démon et s'exécute de manière permanente en arrière-plan pour gérer les requêtes. Ce document décrit comment invoquer [[10-commandes/httpd|httpd]].

## Comment Apache démarre

Si la directive [[13-directives/listen|Listen]] spécifiée dans le fichier de configuration est à sa valeur par défaut de 80 (ou tout autre port inférieur à 1024), il est nécessaire de posséder les privilèges root pour pouvoir démarrer apache, et lui permettre d'être associé à ce port privilégié. Lorsque le serveur est démarré, il effectue quelques opérations préliminaires comme ouvrir ses fichiers de log, puis il lance plusieurs processus *enfants* qui ont pour rôle d'écouter et de répondre aux requêtes des clients. Le processus `httpd` principal continue à s'exécuter sous l'utilisateur root, tandis que les processus enfants s'exécutent sous un utilisateur aux privilèges restreints. Ceci s'effectue par la voie du [[11-guides/01-generalites/modules-multi-processus-mpms|Module Multi-Processus (MPM)]].

Il est recommandé d'utiliser le script de contrôle [[10-commandes/apachectl|apachectl]] pour invoquer l'exécutable [[10-commandes/httpd|httpd]]. A cet effet, ce script définit certaines variables d'environnement nécessaires pour permettre à [[10-commandes/httpd|httpd]] de fonctionner correctement sous certains systèmes d'exploitation. [[10-commandes/apachectl|apachectl]] accepte des arguments de ligne de commande ; ainsi toute option de [[10-commandes/httpd|httpd]] peut aussi être utilisée avec [[10-commandes/apachectl|apachectl]]. Vous pouvez aussi éditer directement le script [[10-commandes/apachectl|apachectl]] en modifiant la variable `HTTPD` située en début de script pour spécifier la localisation du binaire [[10-commandes/httpd|httpd]] et tout argument de ligne de commande que vous souhaitez voir *systématiquement* présent.

La première chose qu'effectue [[10-commandes/httpd|httpd]] quand il est invoqué est de localiser et lire le [[11-guides/01-generalites/fichiers-de-configuration|fichier de configuration]] `httpd.conf`. La localisation de ce fichier est définie à la compilation, mais il est possible d'en spécifier une autre à l'exécution en utilisant l'option de ligne de commande `-f` comme suit:

```
/usr/local/apache2/bin/apachectl -f
      /usr/local/apache2/conf/httpd.conf
```

Si tout se passe bien pendant le démarrage, le serveur va se dissocier du terminal et l'invite de commande réapparaîtra presque immédiatement. Ceci indique que le serveur a démarré et est en cours d'exécution. À partir de ce moment, vous pouvez utiliser votre navigateur pour vous connecter au serveur et afficher la page de test située dans le répertoire défini par la directive [[13-directives/documentroot|DocumentRoot]]

## Erreurs en cours de démarrage

Si un problème fatal survient pendant le démarrage d'Apache, ce dernier va afficher un message décrivant le problème sur la console ou enregistrer ces informations dans le fichier défini par la directive [[13-directives/errorlog|ErrorLog]] avant de quitter. Un des messages d'erreur les plus courants est "`Unable to bind to Port ...`". Ce message d'erreur est habituellement provoqué par :

- Une tentative de démarrage du serveur avec un port privilégié sans être connecté root
- Une tentative de démarrage du serveur alors qu'une autre instance d'Apache ou un autre serveur web est déjà associé au même port.

Pour plus d'instructions de dépannage, consultez la [FAQ](https://cwiki.apache.org/confluence/display/httpd/FAQ) Apache.

## Lancement au démarrage du système

Si vous souhaitez que votre serveur web soit automatiquement disponible après un redémarrage du système, vous devez ajouter un appel à [[10-commandes/apachectl|apachectl]] à vos fichiers de démarrage système (en général `rc.local` ou un fichier dans un répertoire `rc.N`), ce qui démarrera Apache sous l'utilisateur root. Avant de faire ceci, assurez-vous que votre serveur soit correctement configuré en ce qui concerne la sécurité et les restrictions d'accès.

Le script [[10-commandes/apachectl|apachectl]] est conçu pour fonctionner comme un script d'initialisation SysV standard ; il accepte les arguments `start`, `restart`, et `stop` et les traduit en signaux appropriés pour [[10-commandes/httpd|httpd]], et il suffit en général d'installer un lien vers [[10-commandes/apachectl|apachectl]] dans le répertoire d'initialisation approprié. Mais prenez soin de vérifier les besoins exacts de votre système en la matière.

## Informations supplémentaires

Des informations supplémentaires à propos des options en ligne de commande de [[10-commandes/httpd|httpd]] et [[10-commandes/apachectl|apachectl]] ainsi que d'autres programmes support inclus dans la distribution sont disponibles sur la page Le serveur et ses programmes support. Il existe aussi une documentation sur tous les modules inclus dans la distribution Apache et les directives qu'ils supportent.

## Voir aussi

- [[11-guides/01-generalites/arret-et-redemarrage-du-serveur-http-apache|Arrêt et redémarrage]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

---
title: "Support suEXEC"
description: "Apache HTTP Server — Support suEXEC. La fonctionnalité suEXEC permet l'exécution des programmes CGI et SSI sous un utilisateur autre que celui sous lequel s'exécute le serveur web qui appelle ces programmes. Normalement, lorsqu'un programme CGI ou SSI est lancé, il s'exécute s"
tags: [apache, guide]
icon: book-open
---

La fonctionnalité **suEXEC** permet l'exécution des programmes **CGI** et **SSI** sous un utilisateur autre que celui sous lequel s'exécute le serveur web qui appelle ces programmes. Normalement, lorsqu'un programme CGI ou SSI est lancé, il s'exécute sous le même utilisateur que celui du serveur web qui l'appelle.

Utilisée de manière appropriée, cette fonctionnalité peut réduire considérablement les risques de sécurité encourus lorsqu'on autorise les utilisateurs à développer et faire s'exécuter des programmes CGI ou SSI de leur cru. Cependant, mal configuré, suEXEC peut causer de nombreux problèmes et même créer de nouvelles failles dans la sécurité de votre ordinateur. Si vous n'êtes pas familier avec la gestion des programmes *setuid root* et les risques de sécurité qu'ils comportent, nous vous recommandons vivement de ne pas tenter d'utiliser suEXEC.

## Avant de commencer

Avant de foncer tête baissée dans la lecture de ce document, vous devez tenir compte de certaines hypothèses concernant vous-même et l'environnement dans lequel vous allez utiliser suexec.

Premièrement, vous devez utiliser un système d'exploitation UNIX ou dérivé, capable d'effectuer des opérations **setuid** et **setgid**. Tous les exemples de commande sont donnés en conséquence. D'autres plates-formes, même si elles supportent suEXEC, peuvent avoir une configuration différente.

Deuxièmement, vous devez être familier avec les concepts de base relatifs à la sécurité de votre ordinateur et son administration. Ceci implique la compréhension des opérations **setuid/setgid** et des différents effets qu'elles peuvent produire sur votre système et son niveau de sécurité.

Troisièmement, vous devez utiliser une version **non modifiée** du code de suEXEC. L'ensemble du code de suEXEC a été scruté et testé avec soin par les développeurs et de nombreux bêta testeurs. Toutes les précautions ont été prises pour s'assurer d'une base sûre de code non seulement simple, mais aussi solide. La modification de ce code peut causer des problèmes inattendus et de nouveaux risques de sécurité. Il est **vivement** recommandé de ne pas modifier le code de suEXEC, à moins que vous ne soyez un programmeur spécialiste des particularités liées à la sécurité, et souhaitez partager votre travail avec l'équipe de développement du serveur HTTP Apache afin de pouvoir en discuter.

Quatrièmement et dernièrement, l'équipe de développement du serveur HTTP Apache a décidé de ne **PAS** inclure suEXEC dans l'installation par défaut d'Apache httpd. Pour pouvoir mettre en oeuvre suEXEC, l'administrateur doit porter la plus grande attention aux détails. Après avoir bien réfléchi aux différents points de la configuration de suEXEC, l'administrateur peut l'installer selon les méthodes classiques. Les valeurs des paramètres de configuration doivent être déterminées et spécifiées avec soin par l'administrateur, afin de maintenir la sécurité du système de manière appropriée lors de l'utilisation de la fonctionnalité suEXEC. C'est par le biais de ce processus minutieux que nous espérons réserver l'installation de suEXEC aux administrateurs prudents et suffisamment déterminés à vouloir l'utiliser.

Vous êtes encore avec nous ? Oui ? Bien. Alors nous pouvons continuer !

## Modèle de sécurité de suEXEC

Avant d'installer et configurer suEXEC, nous allons tout d'abord décrire le modèle de sécurité que vous êtes sur le point d'implémenter. Vous devriez ainsi mieux comprendre ce qui se passe vraiment à l'intérieur de suEXEC et quelles précautions ont été prises pour préserver la sécurité de votre système.

**suEXEC** est basé sur un programme "conteneur" (wrapper) setuid qui est appelé par le serveur HTTP Apache principal. Ce conteneur est appelé quand une requête HTTP concerne un programme CGI ou SSI que l'administrateur a décidé de faire s'exécuter sous un utilisateur autre que celui du serveur principal. Lorsqu'il reçoit une telle requête, Apache httpd fournit au conteneur suEXEC le nom du programme, ainsi que les identifiants utilisateur et groupe sous lesquels le programme doit s'exécuter.

Le conteneur effectue ensuite les vérifications suivantes afin de déterminer la réussite ou l'échec du processus -- si une seule de ces conditions n'est pas vérifiée, le programme journalise l'erreur et se termine en retournant un code d'erreur, sinon il continue :

1. **L'utilisateur qui exécute le conteneur est-il un utilisateur valide de ce système ?**

   Ceci permet de s'assurer que l'utilisateur qui exécute le conteneur est vraiment un utilisateur appartenant au système.
2. **Le conteneur a-t-il été appelé avec un nombre d'arguments correct ?**

   Le conteneur ne s'exécutera que si on lui fournit un nombre d'arguments correct. Le serveur HTTP apache sait quel est le bon format des arguments. Si le conteneur ne reçoit pas un nombre d'arguments correct, soit il a été modifié, soit quelque chose ne va pas dans la portion suEXEC de votre binaire Apache httpd.
3. **Cet utilisateur valide est-il autorisé à exécuter le conteneur ?**

   Cet utilisateur est-il celui autorisé à exécuter le conteneur ? Un seul utilisateur (celui d'Apache) est autorisé à exécuter ce programme.
4. **Le chemin du programme CGI ou SSI cible est-il non sûr ?**

   Le chemin du programme CGI ou SSI cible débute-t-il par un '/' ou contient-il une référence arrière '..' ? Ceci est interdit ; le programme CGI ou SSI cible doit se trouver dans la hiérarchie de la racine des documents de suEXEC (voir `--with-suexec-docroot=DIR` ci-dessous).
5. **Le nom utilisateur cible est-il valide ?**

   L'utilisateur cible existe-t-il ?
6. **Le nom du groupe cible est-il valide ?**

   Le groupe cible existe-t-il ?
7. **L'utilisateur cible n'est-il *PAS* superutilisateur ?**

   suEXEc ne permet pas à `root` d'exécuter des programmes CGI/SSI.
8. **Le numéro de l'identifiant de l'utilisateur cible est-il *SUPERIEUR* au numéro d'identifiant minimum ?**

   Le numéro d'identifiant utilisateur minimum est défini à l'exécution du script configure. Ceci vous permet de définir le numéro d'identifiant utilisateur le plus bas qui sera autorisé à éxécuter des programmes CGI/SSI. En particulier, cela permet d'écarter les comptes système.
9. **Le groupe cible n'est-il *PAS* le groupe superutilisateur ?**

   Actuellement, suEXEC ne permet pas au groupe `root` d'exécuter des programmes CGI/SSI.
10. **Le numéro d'identifiant du groupe cible est-il *SUPERIEUR* au numéro d'identifiant minimum ?**

    Le numéro d'identifiant de groupe minimum est spécifié lors de l'exécution du script configure. Ceci vous permet de définir l'identifiant de groupe le plus bas possible qui sera autorisé à exécuter des programmes CGI/SSI, et est particulièrement utile pour écarter les groupes "système".
11. **Le conteneur peut-il obtenir avec succès l'identité des utilisateur et groupe cibles ?**

    C'est ici que le programme obtient l'identité des utilisateur et groupe cibles via des appels à setuid et setgid. De même, la liste des accès groupe est initialisée avec tous les groupes auxquels l'utilisateur cible appartient.
12. **Peut-on se positionner dans le répertoire dans dequel sont situés les programmes CGI/SSI ?**

    S'il n'existe pas, il ne peut pas contenir de fichier. Et si l'on ne peut pas s'y positionner, il n'existe probablement pas.
13. **Le répertoire est-il dans l'espace web de httpd ?**

    Si la requête concerne une portion de la racine du serveur, le répertoire demandé est-il dans la hiérarchie de la racine des documents de suEXEC ? Si la requête concerne un [[13-directives/userdir|UserDir]], le répertoire demandé est-il dans la hiérarchie du répertoire défini comme le répertoire utilisateur de suEXEC (voir les options de configuration de suEXEC) ?
14. **L'écriture dans le répertoire est-elle interdite pour un utilisateur autre que le propriétaire**

    Le répertoire ne doit pas être ouvert aux autres utilisateurs ; seul l'utilisateur propriétaire doit pouvoir modifier le contenu du répertoire.
15. **Le programme CGI/SSI cible existe-t-il ?**

    S'il n'existe pas, il ne peut pas être exécuté.
16. **Les utilisateurs autres que le propriétaire n'ont-ils *PAS* de droits en écriture sur le programme CGI/SSI ?**

    Les utilisateurs autres que le propriétaire ne doivent pas pouvoir modifier le programme CGI/SSI.
17. **Le programme CGI/SSI n'est-il *PAS* setuid ou setgid ?**

    Les programmes cibles ne doivent pas pouvoir modifier à nouveau les identifiants utilisateur/groupe.
18. **Le couple utilisateur/groupe cible est-il le même que celui du programme ?**

    L'utilisateur est-il le propriétaire du fichier ?
19. **Peut-on nettoyer avec succès l'environnement des processus afin de garantir la sûreté des opérations ?**

    suExec nettoie l'environnement des processus en établissant un chemin d'exécution sûr (défini lors de la configuration), et en ne passant que les variables dont les noms font partie de la liste de l'environnement sûr (créée de même lors de la configuration).
20. **Le conteneur peut-il avec succès se substituer au programme CGI/SSI cible et s'exécuter ?**

    C'est là où l'exécution de suEXEC s'arrête et où commence celle du programme CGI/ssi cible.

Ce sont les opérations standards effectuées par le modèle de sécurité du conteneur suEXEC. Il peut paraître strict et est susceptible d'imposer de nouvelles limitations et orientations dans la conception des programmes CGI/SSI, mais il a été développé avec le plus grand soin, étape par étape, en se focalisant sur la sécurité.

Pour plus d'informations sur la mesure dans laquelle ce modèle de sécurité peut limiter vos possibilités au regard de la configuration du serveur, ainsi que les risques de sécurité qui peuvent être évités grâce à une configuration appropriée de suEXEC, se référer à la section "Avis à la population !" de ce document.

## Configurer et installer suEXEC

C'est ici que nous entrons dans le vif du sujet.

**Options de configuration de suEXEC**

**`--enable-suexec`**

Cette option active la fonctionnalité suEXEC qui n'est jamais installée ou activée par défaut. Au moins une option `--with-suexec-xxxxx` doit accompagner l'option `--enable-suexec` pour qu'APACI (l'utilitaire de configuration de la compilation d'Apache) accepte votre demande d'utilisation de la fonctionnalité suEXEC.

**`--with-suexec-bin=PATH`**

Le chemin du binaire `suexec` doit être codé en dur dans le serveur pour des raisons de sécurité. Cette option vous permet de modifier le chemin par défaut. *Par exemple* `--with-suexec-bin=/usr/sbin/suexec`

**`--with-suexec-caller=UID`**

L'[[12-modules/mpm_common|utilisateur]] sous lequel httpd s'exécute habituellement. C'est le seul utilisateur autorisé à exécuter le wrapper suEXEC.

**`--with-suexec-userdir=DIR`**

Cette option définit le sous-répertoire de la hiérarchie des répertoires utilisateurs dans lequel l'utilisation de suEXEC sera autorisée. Tous les exécutables situés dans ce répertoire seront exécutables par suEXEC sous l'utilisateur cible ; ces programmes doivent donc être sûrs. Si vous utilisez une directive [[13-directives/userdir|UserDir]] "simple" (c'est à dire ne contenant pas de "\*"), l'option --with-suexec-userdir devra contenir la même valeur. SuEXEC ne fonctionnera pas correctement si la directive [[13-directives/userdir|UserDir]] contient une valeur différente du répertoire home de l'utilisateur tel qu'il est défini dans le fichier `passwd`. la valeur par défaut est "`public_html`".
Si vous avez plusieurs hôtes virtuels avec une directive [[13-directives/userdir|UserDir]] différente pour chacun d'entre eux, vous devrez faire en sorte que chaque UserDir possède un répertoire parent commun ; donnez alors à l'option --with-suexec-userdir le nom de ce répertoire commun. **Si tout ceci n'est pas défini correctement, les requêtes CGI "~userdir" ne fonctionneront pas !**

**`--with-suexec-docroot=DIR`**

Cette option fonctionne comme la directive DocumentRoot pour httpd. Il s'agit de la seule hiérarchie (en dehors des directives [[13-directives/userdir|UserDir]]) dans laquelle la fonctionnalité suEXEC pourra être utilisée. La valeur par défaut est la valeur de `--datadir` accompagnée du suffixe "`/htdocs`" ; *Par exemple*, si vous exécutez configure avec "`--datadir=/home/apache`", la valeur "`/home/apache/htdocs`" sera utilisée par défaut comme racine des documents pour le conteneur suEXEC.

**`--with-suexec-uidmin=UID`**

Cette option définit l'identifiant utilisateur le plus bas avec lequel un utilisateur pourra être la cible de suEXEC. 500 ou 100 sont des valeurs courantes sur la plupart des systèmes. la valeur par défaut est 100.

**`--with-suexec-gidmin=GID`**

Cette option définit l'identifiant de groupe le plus bas avec lequel un utilisateur pourra être la cible de suEXEC. 100 est une valeur courante sur la plupart des systèmes et est par conséquent la valeur par défaut.

**`--with-suexec-logfile=FILE`**

Cette option permet de définir le fichier dans lequel toutes les transactions et erreurs de suEXEC seront journalisées (à des fins d'analyse ou de débogage). Par défaut, le fichier journal se nomme "`suexec_log`" et se trouve dans votre répertoire standard des fichiers journaux défini par `--logfiledir`

**`--with-suexec-safepath=PATH`**

Cette option permet de définir une variable d'environnement PATH sûre à passer aux exécutables CGI. La valeur par défaut est "`/usr/local/bin:/usr/bin:/bin`".

### Compilation et installation du conteneur suEXEC

Si vous avez activé la fonctionnalité suEXEC à l'aide de l'option `--enable-suexec`, le binaire `suexec` sera automatiquement construit (en même temps que httpd) lorsque vous exécuterez la commande `make`.

Lorsque tous les composants auront été construits, vous pourrez exécuter la commande `make install` afin de les installer. Le binaire `suexec` sera installé dans le répertoire défini à l'aide de l'option `--sbindir`. La localisation par défaut est "/usr/local/apache2/bin/suexec".

Veuillez noter que vous aurez besoin des ***privilèges root*** pour passer l'étape de l'installation. Pour que le conteneur puisse changer l'identifiant utilisateur, il doit avoir comme propriétaire `root`, et les droits du fichier doivent inclure le bit d'exécution setuserid.

### \>Mise en place de permissions pour paranoïaque

Bien que le conteneur suEXEC vérifie que l'utilisateur qui l'appelle correspond bien à l'utilisateur spécifié à l'aide de l'option `--with-suexec-caller` du programme [[10-commandes/configure|configure]], il subsiste toujours le risque qu'un appel système ou une bibliothèque fasse appel à suEXEC avant que cette vérification ne soit exploitable sur votre système. Pour tenir compte de ceci, et parce que c'est en général la meilleure pratique, vous devez utiliser les permissions du système de fichiers afin de vous assurer que seul le groupe sous lequel s'exécute httpd puisse faire appel à suEXEC.

Si, par exemple, votre serveur web est configuré pour s'exécuter en tant que :

```apache
User www
Group webgroup
```

et [[10-commandes/suexec|suexec]] se trouve à "/usr/local/apache2/bin/suexec", vous devez exécuter les commandes

```
chgrp webgroup /usr/local/apache2/bin/suexec
chmod 4750 /usr/local/apache2/bin/suexec
```

Ceci permet de s'assurer que seul le groupe sous lequel httpd s'exécute (ici webgroup) puisse faire appel au conteneur suEXEC.

## Activation et désactivation de suEXEC

Au démarrage, httpd vérifie la présence du fichier [[10-commandes/suexec|suexec]] dans le répertoire défini par l'option `--sbindir` du script configure (le répertoire par défaut est "/usr/local/apache/sbin/suexec"). Si httpd trouve un conteneur suEXEC correctement configuré, il enregistrera le message suivant dans le journal des erreurs :

```
[notice] suEXEC mechanism enabled (wrapper: /path/to/suexec)
```

Si ce message n'est pas généré au démarrage du serveur, ce dernier ne trouve probablement pas le programme conteneur à l'endroit où il est sensé être, ou l'exécutable suexec n'est pas installé en *setuid root*.

Si le serveur HTTP Apache est déjà en cours d'exécution, et si vous activez le mécanisme suEXEC pour la première fois, vous devez arrêter et redémarrer httpd. Un redémarrage à l'aide d'un simple signal HUP ou USR1 suffira.

Pour désactiver suEXEC, vous devez supprimer le fichier [[10-commandes/suexec|suexec]], puis arrêter et redémarrer httpd.

## Utilisation de suEXEC

Les requêtes pour des programmes CGI ne feront appel au conteneur suEXEC que si elles concernent un hôte virtuel contenant une directive [[13-directives/suexecusergroup|SuexecUserGroup]], ou si elles sont traitées par [[12-modules/mod_userdir|mod_userdir]].

**Hôtes virtuels :**
Une des méthodes d'utilisation du conteneur suEXEC consiste à insérer une directive [[13-directives/suexecusergroup|SuexecUserGroup]] dans une section [[13-directives/virtualhost|<VirtualHost>]]. En définissant des valeurs différentes de celles du serveur principal, toutes les requêtes pour des ressources CGI seront exécutées sous les *User* et *Group* définis pour cette section [[13-directives/virtualhost|<VirtualHost>]]. Si cette directive est absente de la section [[13-directives/virtualhost|<VirtualHost>]], l'utilisateur du serveur principal sera pris par défaut

**Répertoires des utilisateurs :**
Avec cette méthode, les requêtes traitées par [[12-modules/mod_userdir|mod_userdir]] appelleront le conteneur suEXEC pour exécuter le programme CGI sous l'identifiant utilisateur du répertoire utilisateur concerné. Seuls prérequis pour pouvoir accéder à cette fonctionnalité : l'exécution des CGI doit être activée pour l'utilisateur concerné, et le script doit passer avec succès le test des vérifications de sécurité décrit plus haut. Voir aussi l' option de compilation `--with-suexec-userdir`.

## Débogage de suEXEC

Le conteneur suEXEC va écrire ses informations de journalisation dans le fichier défini par l'option de compilation `--with-suexec-logfile` comme indiqué plus haut. Si vous pensez avoir configuré et installé correctement le conteneur, consultez ce journal, ainsi que le journal des erreurs du serveur afin de déterminer l'endroit où vous avez fait fausse route.

## Avis à la population ! Avertissements et exemples

**NOTE !** Cette section est peut-être incomplète.

Quelques points importants du conteneur peuvent imposer des contraintes du point de vue de la configuration du serveur. Veuillez en prendre connaissance avant de soumettre un rapport de bogue à propos de suEXEC.

**Points importants à propos de suEXEC**

- Limitations concernant la hiérarchie.

  Pour des raisons de sécurité et d'efficacité, toutes les requêtes suEXEC ne doivent concerner que des ressources situées dans la racine des documents définie pour les requêtes concernant un hôte virtuel, ou des ressources situées dans la racine des documents définies pour les requêtes concernant un répertoire utilisateur. Par exemple, si vous avez configuré quatre hôtes virtuels, vous devrez définir la structure des racines de documents de vos hôtes virtuels en dehors d'une hiérarchie de documents principale de httpd, afin de tirer parti de suEXEC dans le contexte des hôtes virtuels (Exemple à venir).
- La variable d'environnement PATH de suEXEC

  Modifier cette variable peut s'avérer dangereux. Assurez-vous que tout chemin que vous ajoutez à cette variable est un répertoire **de confiance**. Vous n'avez probablement pas l'intention d'ouvrir votre serveur de façon à ce que l'on puisse y exécuter un cheval de Troie.
- Modification de suEXEC

  Encore une fois, ceci peut vous causer de **graves ennuis** si vous vous y essayez sans savoir ce que vous faites. Evitez de vous y risquer dans la mesure du possible.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

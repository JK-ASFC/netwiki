---
title: "mod_status"
description: "Module Apache mod_status — Fournit des informations sur les performances et l'activité du serveur. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_status]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit des informations sur les performances et l'activité du serveur |
| **Statut** | Base |
| **Identificateur** | `status_module` |
| **Fichier source** | `mod_status.c` |

## Sommaire

Le module Status permet à un administrateur de déterminer le niveau de performances de son serveur. Les statistiques instantanées du serveur sont présentées dans une page HTML sous une forme aisément lisible. Si nécessaire, cette page peut être configurée pour être automatiquement actualisée (sous réserve de compatibilité du navigateur). Une autre page fournit l'état instantané du serveur sous la forme d'une simple liste lisible par une machine.

Les détails fournis sont :

- Le nombre de processus servant les requêtes
- Le nombre de processus inactifs
- L'état de chaque processus, le nombre de requêtes qu'il a traitées et le nombre total d'octets qu'il a servis (\*)
- Le nombre total d'accès effectués et d'octets servis (\*)
- Le moment où le serveur a été démarré/redémarré et le temps écoulé depuis
- Les valeurs moyennes du nombre de requêtes par seconde, du nombre d'octets servis par seconde et du nombre d'octets par requête (\*)
- Le pourcentage CPU instantané utilisé par chaque processus et par l'ensemble des processus (\*)
- Les hôtes et requêtes actuellement en cours de traitement (\*)

Les lignes se terminant par "(\*)" ne sont disponibles que si la directive [[13-directives/extendedstatus|ExtendedStatus]] est définie à `On`. Depuis la version 2.3.6, le chargement de mod\_status définit automatiquement [[13-directives/extendedstatus|ExtendedStatus]] à On.

## Activation du rapport d'état

Pour n'activer les rapports d'état que pour les navigateurs appartenent au domaine example.com, ajoutez ces lignes à votre fichier de configuration `httpd.conf` :

```apache
<Location "/etat-serveur">
    SetHandler server-status
    Require host example.com
</Location>
```

Il est alors possible d'obtenir les statistiques du serveur en utilisant un navigateur web et en accédant à la page `http://votre.serveur/etat-serveur`.

## Actualisation automatique

Vous pouvez faire en sorte que cette page d'état s'actualise elle-même automatiquement si votre navigateur supporte "refresh". Pour ce faire, accédez à la page `http://votre.serveur/etat-serveur?refresh=N`, pour que cette dernière soit actualisée toutes les N secondes.

## Fichier d'état lisible par une machine

La page `http://votre.serveur/etat-serveur?auto` permet d'obtenir une version du fichier d'état lisible par une machine. Ceci s'avère intéressant dans le cadre d'une exécution automatique : voir le programme en Perl `log_server_status` situé dans le répertoire `/support` de votre distribution du serveur HTTP Apache.

> [!NOTE]
> **Veuillez noter que si [[12-modules/mod_status|mod_status]] a été chargé dans le serveur, son gestionnaire sera disponible dans *tous* les fichiers de configuration, y compris les fichiers de configuration de *niveau répertoire* (par exemple `.htaccess`), ce qui peut avoir des répercutions quant à la sécurité de votre site.**

## Utilisation de server-status pour la recherche de défauts de fonctionnement

La page `server-status` peut servir de point de départ à la recherche de défauts de fonctionnement lorsque votre serveur mobilise toutes les ressources disponibles (CPU ou mémoire), pour identifier quels clients ou requêtes sont la cause du problème.

Tout d'abord, assurez-vous que la directive [[13-directives/extendedstatus|ExtendedStatus]] est bien définie à on, de façon à ce que vous puissiez avoir accès à toutes les informations à propos de la requête et du client pour chaque processus enfant ou thread.

Consultez ensuite la liste des processus en cours (à l'aide de `top`, ou d'un utilitaire de listage des processus similaire), afin d'identifier les processus coupables. Triez l'affichage de `top` par utilisation CPU ou mémoire, en fonction du problème rencontré.

Rechargez la page `server-status` et recherchez les identifiants des processus trouvés précédemment ; vous pourrez alors déterminer quelle requête est traitée par ces processus, pour quel client. Les requêtes peuvent apparaître de manière fugitive, et il se peut que vous deviez effectuer plusieurs essais avant de parvenir à les prendre en flagrant délit, pour ainsi dire.

Cette procédure *devrait* vous permettre de cerner quel client, ou type de requête, sont à l'origine de vos problèmes de charge. Il est probable que vous identifiiez une application web au comportement anormal, ou un client en train d'attaquer votre site.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

---
title: "mod_privileges"
description: "Module Apache mod_privileges — Support des privilèges de Solaris et de l'exécution des serveurs virtuels sous différents identifiants utilisateurs. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_privileges]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Support des privilèges de Solaris et de l'exécution des serveurs virtuels sous différents identifiants utilisateurs. |
| **Statut** | Deprecated |
| **Identificateur** | `privileges_module` |
| **Fichier source** | `mod_privileges.c` |
| **Compatibilité** | Disponible depuis la version 2.3 d'Apache sur les plates-formes Solaris 10 et OpenSolaris |

## Sommaire

Ce module permet l'exécution de différents serveurs virtuels sous différents identifiants Unix *User* et *Group*, et avec différents [Privilèges Solaris](https://docs.oracle.com/cd/E19253-01/816-4863/6mb20lvfd/index.html). En particulier, il apporte au problème de séparation des privilèges entre les différents serveurs virtuels la solution que devait apporter le module MPM abandonné perchild. Il apporte aussi d'autres améliorations en matière de sécurité.

À la différence de perchild, [[12-modules/mod_privileges|mod_privileges]] n'est pas un module MPM. Il travaille *au sein* d'un modèle de traitement pour définir les privilèges et les User/Group *pour chaque requête* dans un même processus. Il n'est donc pas compatible avec les MPM threadés, et refusera de s'exécuter en cas d'utilisation d'un de ces derniers.

[[12-modules/mod_privileges|mod_privileges]] traite des problèmes de sécurité similaires à ceux de [[11-guides/01-generalites/support-suexec|suexec]] ; mais à la différence de ce dernier, il ne s'applique pas seulement aux programmes CGI, mais à l'ensemble du cycle de traitement d'une requête, y compris les applications in-process et les sous-processus. Il convient particulièrement à l'exécution des applications PHP sous **mod\_php**, qui est lui-même incompatible avec les modules MPM threadés. Il est également bien adapté aux autres applications de type script in-process comme **mod\_perl**, **mod\_python**, et **mod\_ruby**, ainsi qu'aux applications en langage C telles que les modules Apache pour lesquels la séparation des privilèges constitue un problème.

## Considérations à propos de sécurité

[[12-modules/mod_privileges|mod_privileges]] introduit de nouveaux problèmes de sécurité dans les situations où du **code non sûr** peut s'exécuter **à l'intérieur du processus du serveur web**. Ceci s'applique aux modules non sûrs, et aux scripts s'exécutant sous des modules comme mod\_php ou mod\_perl. Les scripts s'exécutant en externe (comme par exemple les scripts CGI ou ceux s'exécutant sur un serveur d'applications derrière mod\_proxy ou mod\_jk) ne sont pas concernés.

Les principaux problèmes de sécurité que l'on rencontre avec mod\_privileges sont :

- L'exécution sous un utilisateur système pose les mêmes problèmes de sécurité que mod\_suexec, et pratiquement les mêmes que cgiwrap et suphp.
- Une extension utilisateur (module ou script) malveillante, écrite en connaissant les mécanismes utilisés par **mod\_privileges**, pourrait élever ses privilèges à tout niveau accessible au processus httpd dans tout serveur virtuel. Ceci introduit de nouveaux risques si (et seulement si) mod\_privileges est compilé avec l'option *BIG\_SECURITY\_HOLE*.
- Une extension utilisateur (module ou script) malveillante, écrite en connaissant les mécanismes utilisés par **mod\_privileges**, pourrait élever ses privilèges pour s'attribuer l'identifiant utilisateur d'un autre utilisateur (et/ou groupe) système.

La directive `PrivilegesMode` vous permet de sélectionner soit le mode *FAST*, soit le mode *SECURE*. Vous pouvez panacher les modes en utilisant par exemple le mode *FAST* pour les utilisateurs de confiance et les chemins contenant du code entièrement audité, tout en imposant le mode *SECURE* où un utilisateur non sûr a la possibilité d'introduire du code.

Avant de décrire les modes, il nous faut présenter les cas d'utilisation de la cible : "Benign" ou "Hostile". Dans une situation "Benign", vous voulez séparer les utilisateurs pour leur confort, et les protéger, ainsi que le serveur, contre les risques induits par les erreurs involontaires. Dans une situation "Hostile" - par exemple l'hébergement d'un site commercial - il se peut que des utilisateurs attaquent délibérément le serveur ou s'attaquent entre eux.

**Mode FAST**

En mode *FAST*, les requêtes sont traitées "in-process" avec les uid/gid et privilèges sélectionnés, si bien que la surcharge est négligeable. Ceci convient aux situations "Benign", mais n'est pas sécurisé contre un attaquant augmentant ses privilèges avec un module ou script "in-process".

**Mode SECURE**

Une requête en mode *SECURE* génère un sous-processus qui supprime les privilèges. Ce comportement est très similaire à l'exécution d'un programme CGI avec suexec, mais il reste valable tout au long du cycle de traitement de la requête, avec en plus l'avantage d'un contrôle précis des privilèges.

Vous pouvez sélectionner différents `PrivilegesMode`s pour chaque serveur virtuel, et même dans un contexte de répertoire à l'intérieur d'un serveur virtuel. Le mode *FAST* convient lorsque les utilisateurs sont sûrs et/ou n'ont pas le privilège de charger du code "in-process". Le mode *SECURE* convient dans les cas où du code non sûr peut s'exécuter "in-process". Cependant, même en mode *SECURE*, il n'y a pas de protection contre un utilisateur malveillant qui a la possibilité d'introduire du code supportant les privilèges *avant le début du cycle de traitement de la requête.*

## Directives

- [[13-directives/privilegesmode|PrivilegesMode]]
- [[13-directives/vhostuser|VHostUser]]
- [[13-directives/vhostgroup|VHostGroup]]
- [[13-directives/vhostsecure|VHostSecure]]
- [[13-directives/vhostcgimode|VHostCGIMode]]
- [[13-directives/dtraceprivileges|DTracePrivileges]]
- [[13-directives/vhostprivs|VHostPrivs]]
- [[13-directives/vhostcgiprivs|VHostCGIPrivs]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

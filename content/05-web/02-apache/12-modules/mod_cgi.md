---
title: "mod_cgi"
description: "Module Apache mod_cgi — Exécution des scripts CGI. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_cgi]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Exécution des scripts CGI |
| **Statut** | Base |
| **Identificateur** | `cgi_module` |
| **Fichier source** | `mod_cgi.c` |

## Sommaire

Tout fichier pris en compte par le gestionnaire `cgi-script` sera traité en tant que script CGI et exécuté par le serveur, sa sortie étant renvoyée au client. Les fichiers sont associés à ce gestionnaire soit parce qu'ils possèdent un nom contenant une extension définie par la directive [[13-directives/addhandler|AddHandler]], soit parce qu'ils se situent dans un répertoire défini par une directive [[13-directives/scriptalias|ScriptAlias]].

Comme introduction à l'utilisation des scripts CGI avec Apache, voir notre tutoriel [[11-guides/02-guides-pratiques/didacticiel-du-serveur-http-apache-contenu-dynamique-base-sur-cgi|Les contenus dynamiques avec CGI]].

Il est recommandé d'utiliser le module [[12-modules/mod_cgid|mod_cgid]] à la place de [[12-modules/mod_cgi|mod_cgi]] lorsqu'on utilise un module MPM multi-threadé sous Unix. Vus de l'utilisateur, les deux modules sont pratiquement identiques.

À des fins de compatibilité ascendante, le gestionnaire cgi-script sera aussi activé pour tout fichier possédant le type MIME `application/x-httpd-cgi`. L'utilisation du type MIME magic est obsolète.

## Les variables d'environnement CGI

Le serveur va définir les variables d'environnement CGI comme décrit dans la spécification CGI ([RFC 3875](https://www.rfc-editor.org/rfc/rfc3875)), de la manière suivante :

**PATH\_INFO**

Cette variable ne sera pas disponible si la directive [[13-directives/acceptpathinfo|AcceptPathInfo]] est explicitement définie à `off`. Par défaut, si la directive `AcceptPathInfo` n'est pas définie, [[12-modules/mod_cgi|mod_cgi]] acceptera des informations de chemin (en ajoutant /infos/chemin après le nom du script dans l'URI), alors que le serveur de base retournera une erreur 404 NOT FOUND pour les requêtes contenant des informations de chemin supplémentaires. Ne pas définir la directive `AcceptPathInfo` a le même effet sur les requêtes avec [[12-modules/mod_cgi|mod_cgi]] que de la définir à `On`.

**REMOTE\_HOST**

Cette variable ne sera définie que si la directive [[13-directives/hostnamelookups|HostnameLookups]] est définie à `on` (elle est à `off` par défaut), et si une recherche DNS inverse sur l'adresse IP de l'hôte client aboutit effectivement à un nom d'hôte.

**REMOTE\_IDENT**

Cette variable ne sera définie que si la directive [[13-directives/identitycheck|IdentityCheck]] est définie à `on`, et si l'hôte client supporte le protocole ident. Notez que l'on ne peut accorder une confiance aveugle au contenu de cette variable car il peut être aisément falsifié, et si un mandataire s'intercale entre le client et le serveur, il est totalement inutilisable.

**REMOTE\_USER**

Cette variable ne sera définie que si le script CGI fait l'objet d'une authentification.

Ce module utilise aussi les fonctions de base [ap\_add\_common\_vars](https://ci.apache.org/projects/httpd/trunk/doxygen/group__APACHE__CORE__SCRIPT.html#ga0e81f9571a8a73f5da0e89e1f46d34b1) et [ap\_add\_cgi\_vars](https://ci.apache.org/projects/httpd/trunk/doxygen/group__APACHE__CORE__SCRIPT.html#ga6b975cd7ff27a338cb8752381a4cc14f) pour ajouter des variables d'environnement comme :

**DOCUMENT\_ROOT**

Prend la valeur définie par la directive [[13-directives/documentroot|DocumentRoot]].

**SERVER\_NAME**

Le nom de domaine pleinement qualifié pour la requête considérée

**SERVER\_ADDR**

L'adresse IP du serveur virtuel qui traite la requête

**SERVER\_ADMIN**

Prend la valeur définie par la directive [[13-directives/serveradmin|ServerAdmin]].

Pour une liste exhaustive de ces variables, vous pouvez écrire un script CGI basique qui extrait toutes les variables d'environnement passées par Apache selon un format adapté.

## Débogage des scripts CGI

Le débogage des scripts CGI était difficile par le passé, principalement parce qu'il n'était pas possible d'étudier la sortie (sortie standard et erreurs) des scripts dont l'exécution échouait. Les directives qui suivent permettent une journalisation plus détaillée des erreurs.

### Format du fichier journal CGI

Lorsqu'il est configuré, le journal des erreurs CGI enregistre la sortie de tout programme CGI dont l'exécution ne s'effectue pas correctement. Un script CGI dont l'exécution échoue provoque la journalisation d'une grande quantité d'informations. Les deux premières lignes possèdent toujours le format suivant :

```
%% [date] requête
%% état HTTP nom du script CGI
```

Si le script CGI n'a pas pu démarrer, le fichier journal contiendra les deux lignes supplémentaires suivantes :

```
%%erreur
message d'erreur
```

Par contre, si l'erreur provient du renvoi par le script d'informations incorrectes dans les en-têtes (dû souvent à une bogue du script), les informations suivantes sont journalisées :

```
%requête
Tous les en-têtes de requête HTTP reçus
Les entités POST ou PUT (s'il en existe)
%réponse
Tous les en-têtes générés par le script CGI
%stdout
la sortie standard CGI
%stderr
la sortie d'erreurs standard CGI
```

(Les parties %stdout et %stderr seront absentes si le script n'a rien envoyé sur la sortie standard ou la sortie d'erreurs).

## Directives

- [[13-directives/cgiscripttimeout|CGIScriptTimeout]]
- [[13-directives/scriptlog|ScriptLog]]
- [[13-directives/scriptloglength|ScriptLogLength]]
- [[13-directives/scriptlogbuffer|ScriptLogBuffer]]

## Voir aussi

- [[13-directives/acceptpathinfo|AcceptPathInfo]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

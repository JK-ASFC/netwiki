---
title: "Configuration à l'échelle du serveur"
description: "Apache HTTP Server — Configuration à l'échelle du serveur. Ce document explique le fonctionnement de certaines directives du serveur de base qui sont utilisées pour configurer les opérations élémentaires du serveur."
tags: [apache, guide]
icon: book-open
---

Ce document explique le fonctionnement de certaines directives du serveur de base qui sont utilisées pour configurer les opérations élémentaires du serveur.

## Identification du serveur

- [[13-directives/servername|ServerName]]
- [[13-directives/serveradmin|ServerAdmin]]
- [[13-directives/serversignature|ServerSignature]]
- [[13-directives/servertokens|ServerTokens]]
- [[13-directives/usecanonicalname|UseCanonicalName]]
- [[13-directives/usecanonicalphysicalport|UseCanonicalPhysicalPort]]

Les directives [[13-directives/serveradmin|ServerAdmin]] et [[13-directives/servertokens|ServerTokens]] contrôlent la nature des informations à propos du serveur qui seront affichées dans les documents générés par le serveur comme les messages d'erreur. La directive [[13-directives/servertokens|ServerTokens]] définit la valeur du champ d'en-tête de la réponse du serveur HTTP.

Le serveur utilise les directives [[13-directives/servername|ServerName]], [[13-directives/usecanonicalname|UseCanonicalName]] et [[13-directives/usecanonicalphysicalport|UseCanonicalPhysicalPort]] pour déterminer la manière de construire des URLs vers ses propres ressources. Par exemple, quand un client émet une requête vers un répertoire, mais n'ajoute pas le slash final au nom du répertoire, httpd doit rediriger le client vers le nom complet incluant le slash final afin que le client puisse résoudre correctement les références relatives présentes dans le document.

## Localisation des fichiers

- [[13-directives/coredumpdirectory|CoreDumpDirectory]]
- [[13-directives/documentroot|DocumentRoot]]
- [[13-directives/errorlog|ErrorLog]]
- [[13-directives/mutex|Mutex]]
- [[13-directives/pidfile|PidFile]]
- [[13-directives/scoreboardfile|ScoreBoardFile]]
- [[13-directives/serverroot|ServerRoot]]

Ces directives contrôlent la localisation des différents fichiers nécessaires au bon fonctionnement de httpd. Quand le chemin utilisé ne commence pas par un slash (/), la localisation des fichiers est relative à la valeur de la directive [[13-directives/serverroot|ServerRoot]]. Soyez prudent avec la localisation de fichiers dans des répertoires où les utilisateurs non root ont les droits en écriture. Voir la documention sur les [[11-guides/06-divers/conseils-sur-la-securite|Conseils à propos de la sécurité]] pour plus de détails.

## Limitation de l'utilisation des ressources

- [[13-directives/limitrequestbody|LimitRequestBody]]
- [[13-directives/limitrequestfields|LimitRequestFields]]
- [[13-directives/limitrequestfieldsize|LimitRequestFieldsize]]
- [[13-directives/limitrequestline|LimitRequestLine]]
- [[13-directives/rlimitcpu|RLimitCPU]]
- [[13-directives/rlimitmem|RLimitMEM]]
- [[13-directives/rlimitnproc|RLimitNPROC]]
- [[13-directives/threadstacksize|ThreadStackSize]]

Les directives `LimitRequest`\* permettent de limiter la quantité de ressources consommées par httpd pour le traitement des requêtes des clients. Cette limitation permet de minimiser les effets de certains types d'attaques par déni de service.

Les directives `RLimit`\* permettent de limiter la quantité de ressources utilisable par les processus initiés (forked) par les processus enfants httpd. Elles permettent en particulier de contrôler les ressources utilisées par les scripts CGI et les commandes exec des "Inclusions côté serveur" (Server Side Includes ou SSI).

La directive [[13-directives/threadstacksize|ThreadStackSize]] permet sur certaines plates-formes de contrôler la taille de la pile.

## Choix d'implémentation

- [[13-directives/mutex|Mutex]]

La directive `Mutex` permet de modifier l'implémentation sous-jacente des mutex, afin de résoudre les problèmes de fonctionnement ou de performance dus au choix par défaut d'APR.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

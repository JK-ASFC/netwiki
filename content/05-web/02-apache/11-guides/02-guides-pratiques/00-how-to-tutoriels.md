---
title: "How-To / Tutoriels"
description: "Apache HTTP Server — How-To / Tutoriels."
tags: [apache, guide]
icon: book-open
---

## How-To / Tutoriels

**Authentification et autorisation**

L'authentification représente tout processus par lequel vous vérifiez si quelqu'un correspond bien à la personne qu'il prétend être. L'autorisation représente tout processus permettant de savoir si une personne est autorisée à aller là où elle veut aller, ou à obtenir les informations qu'elle demande.

Voir [[11-guides/02-guides-pratiques/authentification-et-autorisation|Authentification, Autorisation]]

**Contrôle d'accès**

Le contrôle d'accès se réfère au processus permettant d'interdire ou d'accorder l'accès à une ressource en fonction de certains critères, et il existe de nombreuses façons d'y parvenir.

Voir [[11-guides/02-guides-pratiques/controle-d-acces|Contrôle d'accès]]

**Contenu dynamique avec CGI**

L'interface CGI (Common Gateway Interface) fournit au serveur web une méthode d'interaction avec des programmes externes générateurs de contenu, souvent nommés programmes CGI ou scripts CGI. Il s'agit d'une méthode simple permettant d'ajouter du contenu dynamique à votre site web. Ce document se veut une introduction à la configuration de CGI sur votre serveur web Apache et à l'écriture de programmes CGI.

Voir [[11-guides/02-guides-pratiques/didacticiel-du-serveur-http-apache-contenu-dynamique-base-sur-cgi|CGI : contenu dynamique]]

**Fichiers `.htaccess`**

Les fichiers `.htaccess` permettent de modifier la configuration du serveur au niveau de chaque répertoire. À cet effet, un fichier est placé dans un répertoire particulier du site web, et les directives de configuration qu'il contient s'appliquent à ce répertoire et à tous ses sous-répertoires.

Voir [[11-guides/02-guides-pratiques/tutoriel-du-serveur-http-apache-fichiers-htaccess|Fichiers .htaccess]]

**HTTP/2 avec httpd**

HTTP/2 est une évolution du protocole de la couche application le plus connu au monde, HTTP. Les efforts se sont concentrés sur une amélioration de l'efficacité de l'utilisation des ressources réseau sans modifier la sémantique de HTTP. Ce guide explique la manière dont HTTP/2 est implémenté dans httpd, donne des conseils pour une configuration de base ainsi qu'une liste de recommandations.

Voir le [[11-guides/02-guides-pratiques/guide-http-2|guide HTTP/2]]

**Introduction au Inclusions côté Serveur (Server Side Includes ou SSI)**

Les SSI sont des directives que l'on place dans des pages HTML, et qui sont évaluées par le serveur lorsque ces pages sont servies. Elles vous permettent d'ajouter du contenu généré dynamiquement à une page HTML existante, sans avoir à servir l'intégralité de la page via un programme CGI, ou toute autre technologie dynamique.

Voir [[11-guides/02-guides-pratiques/tutoriel-apache-httpd-introduction-aux-inclusions-cote-serveur-server-|Server Side Includes (SSI)]]

**Répertoires web de l'utilisateur**

Sur les systèmes multi-utilisateurs, vous pouvez permettre à chaque utilisateur d'avoir un site web dans son répertoire home via la directive [[13-directives/userdir|UserDir]]. Les visiteurs de l'URL `http://example.com/~nom-utilisateur/` vont recevoir du contenu situé dans le répertoire home de l'utilisateur "`nom-utilisateur`", et dans le sous-répertoire spécifié par la directive [[13-directives/userdir|UserDir]].

Voir [[11-guides/02-guides-pratiques/repertoires-web-utilisateurs|Répertoires web des utilisateurs (public_html)]]

**Mandataires inverses**

Apache httpd possède des fonctionnalités évoluées de serveur mandataire inverse via ses directives [[13-directives/proxypass|ProxyPass]] et [[13-directives/balancermember|BalancerMember]] qui permettent d'implémenter un système de mandataire inverse sophistiqué garantissant une haute disponibilité, une répartition et une réattribution de charge, un regroupement de serveurs en grappe (clustering) basé sur le cloud et une reconfiguration dynamique à la volée.

Voir le [[11-guides/02-guides-pratiques/guide-de-configuration-d-un-mandataire-inverse|guide-de-configuration-d-un-mandataire-inverse]]Guide de configuration des mandataires inverses

**Réécriture d'URLs avec mod\_rewrite**

La réécriture d'URLs avec (ou sans) [[12-modules/mod_rewrite|mod_rewrite]] devient l'une des questions les plus fréquentes posées dans nos listes de diffusion et nos canaux IRC. C'est pourquoi nous avons dédié une [[11-guides/05-reecriture-mod-rewrite/00-guide-pour-le-module-apache-mod-rewrite|section entière de notre documentation]] à des howtos et recettes sur ce sujet.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

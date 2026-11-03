---
title: "Guide pour le module Apache mod_rewrite"
description: "Apache HTTP Server — Guide pour le module Apache mod_rewrite. Le point fort de mod_rewrite réside dans le fait qu'il possède toutes les capacités de configuration et la flexibilité de Sendmail ;mais c'est aussi son point faible. -- Brian Behlendorf Malgré la multitude d'exemples et de documentations,"
tags: [apache, guide]
icon: book-open
---

*Le point fort de mod\_rewrite réside dans le fait qu'il possède toutes les capacités de configuration et la flexibilité de Sendmail ;mais c'est aussi son point faible.* -- Brian Behlendorf

*Malgré la multitude d'exemples et de documentations, mod\_rewrite est de la magie noire. De la magie noire très "cool", mais de la magie noire quand-même.*

[[12-modules/mod_rewrite|mod_rewrite]] permet de modifier les requêtes entrantes dynamiquement, en fonction de règles manipulant des [[11-guides/05-reecriture-mod-rewrite/introduction-au-module-apache-mod-rewrite|expressions rationnelles]]. Vous pouvez ainsi relier des URLs arbitraires à votre propre structure d'URLs interne comme vous le souhaitez.

Ce guide est un complément du [[12-modules/mod_rewrite|manuel de référence]] avec des exemples commentés, des explications conceptuelles et des conseils pratiques. Il est organisé comme suit :

**[[11-guides/05-reecriture-mod-rewrite/introduction-au-module-apache-mod-rewrite|Introduction]]**

Concepts de base : syntaxe des expressions rationnelles, les bases des directives RewriteRule et RewriteCond et la manière dont mod\_rewrite s'insère dans le cycle de vie du traitement des requêtes.

**[[11-guides/05-reecriture-mod-rewrite/reecritures-au-niveau-repertoire|Réécritures en fonction du répertoire]]**

Les principales différences entre l'utilisation des règles de réécriture au niveau de la configuration globale du serveur et leur utilisation dans un contexte de répertoire, y compris la suppression du chemin, RewriteBase et la gestion du bouclage par le drapeau \[L\].

**[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture|Drapeaux des règles de réécriture]]**

Une référence complète de tous les drapeaux qui peuvent modifier le comportement d'une règle de réécriture avec des exemples pour chacun d'entre eux.

**[[11-guides/05-reecriture-mod-rewrite/utilisation-de-rewritemap|Utiliser RewriteMap]]**

Comment utiliser des sources de recherche externes — fichiers texte, bases de données DBM, requêtes SQL et fonctions internes — pour piloter vos règles de réécriture.

**[[11-guides/05-reecriture-mod-rewrite/redirection-et-remise-en-correspondance-avec-mod-rewrite|Redirection et remappage]]**

Des recettes pour les tâches courantes : redirection HTTPS, noms d'hôte canoniques, normalisation des barres obliques de fin, routage du contrôleur frontal, et plus encore.

**[[11-guides/05-reecriture-mod-rewrite/hebergement-virtuel-de-masse-avec-mod-rewrite|Serveurs virtuels dynamiques]]**

Utilisation de mod\_rewrite pour associer dynamiquement les noms d'hôte aux racines de document sans devoir créer des blocs VirtualHost individuels.

**[[11-guides/05-reecriture-mod-rewrite/quand-ne-pas-utiliser-mod-rewrite|Quand ne pas utiliser mod_rewrite]]**

De nombreuses tâches courantes sont accomplies de manière bien plus efficace avec des directives plus simples. Ce document vous propose des solutions de remplacement et vous indique quand il est préférable de les utiliser.

**[[11-guides/05-reecriture-mod-rewrite/details-techniques-sur-le-module-apache-mod-rewrite|Détails techniques]]**

Comment mod\_rewrite s'insère dans les phases de traitement des requêtes par httpd et l'ordre dans lequel les règles et les conditions sont évaluées.



## Voir aussi

- [[12-modules/mod_rewrite|Documentation de référence de mod_rewrite]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

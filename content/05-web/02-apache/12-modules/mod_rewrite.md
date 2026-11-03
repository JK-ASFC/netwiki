---
title: "mod_rewrite"
description: "Module Apache mod_rewrite — Ce module fournit un moteur de réécriture à base de règles permettant de réécrire les URLs des requêtes à la volée. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_rewrite]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ce module fournit un moteur de réécriture à base de règles permettant de réécrire les URLs des requêtes à la volée |
| **Statut** | Extension |
| **Identificateur** | `rewrite_module` |
| **Fichier source** | `mod_rewrite.c` |

## Sommaire

Le module [[12-modules/mod_rewrite|mod_rewrite]] utilise un moteur de réécriture à base de règles, basé sur un interpréteur d'expressions rationnelles PCRE, pour réécrire les URLs à la volée. Par défaut, [[12-modules/mod_rewrite|mod_rewrite]] met en correspondance une URL avec le système de fichiers. Cependant, on peut aussi l'utiliser pour rediriger une URL vers une autre URL, ou pour invoquer une requête interne à destination du mandataire.

[[12-modules/mod_rewrite|mod_rewrite]] fournit une méthode souple et puissante pour manipuler les URLs en utilisant un nombre illimité de règles. Chaque règle peut être associée à un nombre illimité de conditions, afin de vous permettre de réécrire les URLs en fonction de variables du serveur (y compris les en-têtes HTTP, les détails de la connexion et les horodatages), de variables d'environnement ou d’autres propriétés de la requête. Les règles peuvent agir sur le chemin d’URL (y compris toute [[13-directives/acceptpathinfo|information en fin de nom de chemin]]) et peut aussi modifier la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|chaîne de paramètres]].

Une règle de réécriture peut être invoquée dans les fichiers de configuration globale du serveur ou dans un contexte de répertoire. La chaîne de substitution d’une règle de réécriture peut comporter une chaîne de paramètres et une règle peut renvoyer vers un traitement secondaire interne, une redirection vers une requête externe ou vers le mandataire interne.

Vous trouverez plus de détails, discussions et exemples dans le [[11-guides/05-reecriture-mod-rewrite/00-guide-pour-le-module-apache-mod-rewrite|Guide détaillé sur mod_rewrite]].

## Journalisation

[[12-modules/mod_rewrite|mod_rewrite]] offre une journalisation détaillée de ses actions aux niveaux de journalisation `trace1` à `trace8`. Le niveau de journalisation peut être défini de manière spécifique à [[12-modules/mod_rewrite|mod_rewrite]] via la directive [[13-directives/loglevel|LogLevel]] : jusqu'au niveau `debug` aucune action n'est journalisée, alors qu'elles le sont pratiquement toutes au niveau `trace8`.

> [!NOTE]
> L'utilisation d'un niveau de journalisation élevé pour [[12-modules/mod_rewrite|mod_rewrite]] va ralentir votre serveur HTTP Apache de manière dramatique ! N'utilisez un niveau de journalisation supérieur à `trace2` qu'à des fins de débogage !

**Exemple**

```apache
LogLevel alert rewrite:trace3
```

> [!NOTE]
> **RewriteLog**
>
> Ceux qui sont familiers avec les versions précédentes de [[12-modules/mod_rewrite|mod_rewrite]] vont probablement rechercher en vain les directives `RewriteLog` et `RewriteLogLevel`. Depuis la sortie de httpd 2.4, ces directives ont en effet été remplacées par une configuration de la journalisation par module à l’aide de la directive [[13-directives/loglevel|LogLevel]].
>
> Pour extraire les traces spécifiques à [[12-modules/mod_rewrite|mod_rewrite]], affichez le fichier journal en redirigeant la sortie vers grep :
>
> ```bash
> tail -f error_log|fgrep '[rewrite:'
> ```

## Directives

- [[13-directives/rewriteengine|RewriteEngine]]
- [[13-directives/rewriteoptions|RewriteOptions]]
- [[13-directives/rewritemap|RewriteMap]]
- [[13-directives/rewritebase|RewriteBase]]
- [[13-directives/rewritecond|RewriteCond]]
- [[13-directives/rewriterule|RewriteRule]]

## Voir aussi

- Guide de mod\_rewrite

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

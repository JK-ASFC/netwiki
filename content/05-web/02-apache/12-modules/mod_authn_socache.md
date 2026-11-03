---
title: "mod_authn_socache"
description: "Module Apache mod_authn_socache — Gère un cache des données d'authentification pour diminuer la charge des serveurs d'arrière-plan. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authn_socache]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Gère un cache des données d'authentification pour diminuer la charge des serveurs d'arrière-plan |
| **Statut** | Base |
| **Identificateur** | `authn_socache_module` |
| **Fichier source** | `mod_authn_socache.c` |
| **Compatibilité** | Versions 2.3 et ultérieures |

## Sommaire

Maintient un cache des données d'authentification pour limiter les sollicitations du serveur d'arrière-plan.

## Mise en cache des données d'authentification

Certains utilisateurs qui mettent en oeuvre une authentification lourde s'appuyant par exemple sur des requêtes SQL ([[12-modules/mod_authn_dbd|mod_authn_dbd]]) ont signalé une charge induite inacceptable sur leur fournisseur d'authentification. Cela se produit typiquement dans le cas où une page HTML contient des centaines d'objets (images, scripts, pages de styles, media, etc...), et où une requête pour cette page génère des centaines de sous-requêtes à effet immédiat pour des contenus supplémentaires authentifiés.

Pour résoudre ce problème, [[12-modules/mod_authn_socache|mod_authn_socache]] fournit une solution qui permet de maintenir un cache des données d'authentification.

## Utilisation

Le cache d'authentification doit être utilisé lorsque les requêtes d'authentification induisent une charge significative sur le serveur, le serveur d'arrière-plan ou le réseau. Cette mise en cache n'apportera probablement aucune amélioration dans le cas d'une authentification à base de fichier ([[12-modules/mod_authn_file|mod_authn_file]]) ou de base de données dbm ([[12-modules/mod_authn_dbm|mod_authn_dbm]]) car ces méthodes sont de par leur conception rapides et légères (la mise en cache peut cependant s'avérer utile dans le cas où le fichier est situé sur un montage réseau). Les fournisseurs d'authentification basés sur SQL ou LDAP ont plus de chances de tirer parti de cette mise en cache, en particulier lorsqu'un problème de performances est détecté. [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] gérant son propre cache, seul [[12-modules/mod_authn_dbd|mod_authn_dbd]] est concerné par notre sujet.

Les principales règles à appliquer pour la mise en cache sont :

1. Inclure le fournisseur pour lequel vous voulez effectuer une mise en cache dans une directive [[13-directives/authncacheprovidefor|AuthnCacheProvideFor]].
2. Mettre *socache* avant le fournisseur pour lequel vous voulez effectuer une mise en cache dans votre directive [[13-directives/authbasicprovider|AuthBasicProvider]] ou [[13-directives/authdigestprovider|AuthDigestProvider]].

Voici un exemple simple permettant d'accélérer [[12-modules/mod_authn_dbd|mod_authn_dbd]] et utilisant dbm comme moteur de la mise en cache :

```apache
    #AuthnCacheSOCache est optionnel. S'il est défini, il l'est pour
    #l'ensemble du serveur
AuthnCacheSOCache dbm
<Directory "/usr/www/myhost/private">
    AuthType Basic
    AuthName "Cached Authentication Example"
    AuthBasicProvider socache dbd
    AuthDBDUserPWQuery "SELECT password FROM authn WHERE user = %s"
    AuthnCacheProvideFor dbd
    Require valid-user
    #Optionnel
    AuthnCacheContext dbd-authn-example
</Directory>
```

## La mise en cache avec les modules tiers

Les développeurs de modules doivent savoir que la mise en cache avec [[12-modules/mod_authn_socache|mod_authn_socache]] doit être activée dans leurs modules. La fonction de l'API *ap\_authn\_cache\_store* permet de mettre en cache les données d'authentification qu'un fournisseur vient de rechercher ou de générer. Vous trouverez des exemples d'utilisation à [r957072](http://svn.eu.apache.org/viewvc?view=revision&revision=957072), où trois fournisseurs authn sont activés pour la mise en cache.

## Directives

- [[13-directives/authncacheenable|AuthnCacheEnable]]
- [[13-directives/authncachesocache|AuthnCacheSOCache]]
- [[13-directives/authncacheprovidefor|AuthnCacheProvideFor]]
- [[13-directives/authncachetimeout|AuthnCacheTimeout]]
- [[13-directives/authncachecontext|AuthnCacheContext]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

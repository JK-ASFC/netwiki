---
title: "mod_access_compat"
description: "Module Apache mod_access_compat — Autorisations de groupe à base de nom d'hôte (nom ou adresse IP). Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_access_compat]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Autorisations de groupe à base de nom d'hôte (nom ou adresse IP) |
| **Statut** | Deprecated |
| **Identificateur** | `access_compat_module` |
| **Fichier source** | `mod_access_compat.c` |
| **Compatibilité** | Disponible dans la version 2.3 du serveur HTTP Apache à des fins de compatibilité avec les précédentes versions d'Apache httpd 2.x. Les directives fournies par ce module sont devenues obsolètes depuis la refonte d'authz. Voir [[12-modules/mod_authz_host\\|mod_authz_host]] |

## Sommaire

Les directives fournies par le module [[12-modules/mod_access_compat|mod_access_compat]] s'utilisent dans les sections [[13-directives/directory|<Directory>]], [[13-directives/files|<Files>]] et [[13-directives/location|<Location>]], ainsi que dans les fichiers `.htaccess` et permettent de contrôler l'accès à certaines parties du serveur. On peut contrôler cet accès en fonction du nom d'hôte du client, de son adresse IP ou d'autres caractéristiques de la requête, telles qu'elles sont enregistrées dans les [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|variables d'environnement]]. Les directives [[13-directives/allow|Allow]] et [[13-directives/deny|Deny]] permettent de spécifier quels clients sont ou ne sont pas autorisés à accéder au serveur, alors que la directive [[13-directives/order|Order]] définit le statut d'accès par défaut, et détermine la manière dont les directives [[13-directives/allow|Allow]] et [[13-directives/deny|Deny]] interagissent entre elles.

Les restrictions d'accès à base de nom d'hôte et l'authentification à base de mot de passe peuvent être implémentées simultanément. Dans ce cas, on utilise la directive [[13-directives/satisfy|Satisfy]] pour déterminer la manière dont ces deux modes de restrictions interagissent.

> [!WARNING]
> **Note**
>
> Les directives fournies par le module [[12-modules/mod_access_compat|mod_access_compat]] sont devenues obsolètes depuis la refonte du module [[12-modules/mod_authz_host|mod_authz_host]]. Mélanger d'anciennes directives comme [[13-directives/order|Order]], [[13-directives/allow|Allow]] ou [[13-directives/deny|Deny]] avec des nouvelles comme [[13-directives/require|Require]] est techniquement possible mais déconseillé. En effet, [[12-modules/mod_access_compat|mod_access_compat]] a été conçu pour supporter des configurations ne contenant que des anciennes directives afin de faciliter le passage à la version 2.4. Voir le document [[11-guides/01-generalites/mise-a-jour-de-la-version-2-2-vers-la-version-2-4|upgrading]] pour plus de détails.

En général, les directives de restriction d'accès s'appliquent à toutes les méthodes d'accès (`GET`, `PUT`, `POST`, etc...). C'est d'ailleurs ce que l'on souhaite dans la plupart des cas. Il est cependant possible de restreindre certaines méthodes, alors que les autres méthodes ne se verront imposée aucune restriction, en regroupant les directives à l'intérieur d'une section [[13-directives/limit|<Limit>]].

> [!NOTE]
> **Fusion des sections de configuration**
>
> Lorsqu'une directive fournie par ce module est utilisée dans une nouvelle section de configuration, cette dernière n'hérite d'aucune directive définie dans une section précédente.

## Directives

- [[13-directives/allow|Allow]]
- [[13-directives/deny|Deny]]
- [[13-directives/order|Order]]
- [[13-directives/satisfy|Satisfy]]

## Voir aussi

- [[13-directives/require|Require]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

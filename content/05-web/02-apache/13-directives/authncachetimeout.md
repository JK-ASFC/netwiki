---
title: "AuthnCacheTimeout"
description: "Directive Apache AuthnCacheTimeout (mod_authn_socache) — Définit une durée de vie pour les entrées du cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_socache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une durée de vie pour les entrées du cache |
| **Syntaxe** | `AuthnCacheTimeout durée-de-vie (secondes)` |
| **Valeur par défaut** | `AuthnCacheTimeout 300 (5 minutes)` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authn_socache\|mod_authn_socache]] |

## Utilisation

La mise en cache des données d'authentification peut constituer un trou de sécurité, bien qu'un mise en cache de courte durée ne posera probablement pas de problème. En général, il est conseillé de conserver les entrées du cache de façon à ce que la charge du serveur d'arrière-plan reste normale, mais pas plus longtemps ; une durée de vie plus longue peut être paramétrée si les changements d'utilisateurs et de mots de passe sont peu fréquents. La durée de vie par défaut de 300 secondes (5 minutes) est à la fois raisonnable et suffisamment importante pour réduire la charge d'un serveur d'arrière-plan comme dbd (requêtes SQL).

Cette durée de vie ne doit pas être confondue avec la durée de vie de session qui est un tout autre sujet. Cependant, vous devez utiliser votre logiciel de gestion de session pour vérifier si les données d'authentification mises en cache peuvent allonger accidentellement une session, et en tenir compte lorsque vous définissez la durée de vie.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

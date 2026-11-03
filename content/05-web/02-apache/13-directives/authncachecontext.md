---
title: "AuthnCacheContext"
description: "Directive Apache AuthnCacheContext (mod_authn_socache) — Spécifie une chaîne de contexte à utiliser dans la clé du cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_socache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie une chaîne de contexte à utiliser dans la clé du cache |
| **Syntaxe** | `AuthnCacheContext directory\|server\|custom-string` |
| **Valeur par défaut** | `AuthnCacheContext directory` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authn_socache\|mod_authn_socache]] |

## Utilisation

Cette directive permet de spécifier une chaîne à utiliser avec le nom d'utilisateur fourni (et le domaine d'authentification - realm - dans le cas d'une authentification à base de condensés) lors de la construction d'une clé de cache. Ceci permet de lever l'ambiguïté entre plusieurs noms d'utilisateurs identiques servant différentes zones d'authentification sur le serveur.

Il y a deux valeurs spéciales pour le paramètre : `directory`, qui utilise le contexte de répertoire de la requête comme chaîne, et `server`, qui utilise le nom du serveur virtuel.

La valeur par défaut est `directory`, qui est aussi la définition la plus courante. Ceci est cependant loin d'être optimal, car par exemple, *$app-base*, *$app-base/images*, *$app-base/scripts* et *$app-base/media* possèderont chacun leur propre clé de cache. Il est préférable d'utiliser le fournisseur de mot de passe : par exemple un fichier *htpasswd* ou une table de base de données.

Les contextes peuvent être partagés entre différentes zones du serveur, où les données d'authentification sont partagées. Ceci est cependant susceptible de créer des trous de sécurité de type cross-site ou cross-application, et cette directive n'est donc pas disponible dans les contextes *.htaccess*.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

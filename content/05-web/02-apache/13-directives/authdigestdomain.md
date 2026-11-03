---
title: "AuthDigestDomain"
description: "Directive Apache AuthDigestDomain (mod_auth_digest) — Les URIs qui se trouvent dans le même espace de protection concernant l'authentification à base de condensés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_digest]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Les URIs qui se trouvent dans le même espace de protection concernant l'authentification à base de condensés |
| **Syntaxe** | `AuthDigestDomain URI [URI] ...` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_auth_digest\|mod_auth_digest]] |

## Utilisation

La directive `AuthDigestDomain` vous permet de spécifier un ou plusieurs URIs se trouvant dans le même espace de protection (c'est à dire utilisant le même utilisateur/mot de passe et se trouvant dans le même domaine). Les URIs spécifiés sont des préfixes ; le client doit savoir que tous les URIs situés sous ces préfixes seront protégés par le même utilisateur/mot de passe. Les URIs peuvent être soit des URIs absolus (c'est à dire avec protocole, nom serveur, port, etc...), soit des URIs relatifs.

Cette directive doit toujours être présente et contenir au moins le(s) URI(s) racine(s) pour cet espace. Dans le cas contraire, le client va envoyer un en-tête d'autorisation avec *chaque requête* à destination de ce serveur.

Les URIs spécifiés peuvent aussi référencer différents serveurs, auquel cas les clients (qui sont à même de le comprendre) vont partager l'utilisateur/mot de passe entre plusieurs serveurs sans le demander à l'utilisateur à chaque fois.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

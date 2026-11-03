---
title: "AuthBasicUseDigestAlgorithm"
description: "Directive Apache AuthBasicUseDigestAlgorithm (mod_auth_basic) — Vérifie les mots de passe auprès des fournisseurs d'authentification à la manière de l'authentification de type Digest. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_basic]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Vérifie les mots de passe auprès des fournisseurs d'authentification à la manière de l'authentification de type Digest. |
| **Syntaxe** | `AuthBasicUseDigestAlgorithm MD5\|Off` |
| **Valeur par défaut** | `AuthBasicUseDigestAlgorithm Off` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_basic\|mod_auth_basic]] |
| **Compatibilité** | Disponible à partir de la version 2.4.7 du serveur HTTP Apache |

## Utilisation

Normalement, lorsqu'on utilise l'authentification basique, les fournisseurs spécifiés via la directive [[13-directives/authbasicprovider|AuthBasicProvider]] tentent de contrôler l'identité d'un utilisateur en recherchant dans leurs bases de données l'existence d'un couple utilisateur/mot de passe correspondant. Les mots de passe enregistrés sont en général chiffrés, mais ce n'est pas systématique ; chaque fournisseur peut choisir son propre mode de stockage des mots de passe.

Lorsqu'on utilise l'authentification de type Digest, les fournisseurs spécifiés par la directive [[13-directives/authdigestprovider|AuthDigestProvider]] effectuent une recherche similaire dans leurs bases de données pour trouver un couple utilisateur/mot de passe correspondant. Cependant, à la différence de l'authentification basique, les données associées à chaque utilisateur et comportant le nom d'utilisateur, le domaine de protection (realm) et le mot de passe doivent être contenues dans une chaîne chiffrée (Voir le document [RFC 2617](https://www.rfc-editor.org/rfc/rfc2617) pour plus de détails à propos du type de chiffrement utilisé pour cette chaîne).

A cause de la différence entre les méthodes de stockage des données des authentifications de type basique et digest, le passage d'une méthode d'authentification de type digest à une méthode d'authentification de type basique requiert l'attribution de nouveaux mots de passe à chaque utilisateur, car leur mots de passe existant ne peut pas être extrait à partir du schéma de stockage utilisé par les fournisseurs d'authentification de type digest.

Si la directive `AuthBasicUseDigestAlgorithm` est définie à la valeur `MD5`, le mot de passe d'un utilisateur dans le cas de l'authentification basique sera vérifié en utilisant le même format de chiffrement que dans le cas de l'authentification de type digest. Tout d'abord, une chaîne comportant le nom d'utilisateur, le domaine de protection (realm) et le mot de passe est générée sous forme de condensé (hash) en utilisant l'algorithme MD5 ; puis le nom d'utilisateur et cette chaîne chiffrée sont transmis aux fournisseurs spécifiés via la directive [[13-directives/authbasicprovider|AuthBasicProvider]] comme si la directive [[13-directives/authtype|AuthType]] était définie à `Digest` et si l'authentification de type Digest était utilisée.

Grâce à cette directive, un site peut basculer d'une authentification de type digest à basique sans devoir changer les mots de passe des utilisateurs.

> [!NOTE]
> Le processus inverse consistant à passer d'une authentification de type basique à digest sans changer les mots de passe n'est en général pas possible. Les mots de passe enregistrés dans le cas d'une authentification de type basique ne pourront être extraits et chiffrés à nouveau selon le schéma de l'authentification de type digest, que s'ils ont été stockés en clair ou selon un schéma de chiffrement réversible.

> [!NOTE]
> Seuls les fournisseurs qui supportent l'authentification de type digest pourront authentifier les utilisateurs lorsque la directive `AuthBasicUseDigestAlgorithm` est définie à `MD5`. L'utilisation d'un autre fournisseur provoquera un message d'erreur et le client se verra refuser l'accès.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

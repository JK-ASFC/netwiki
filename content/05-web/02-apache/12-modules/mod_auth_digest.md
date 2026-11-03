---
title: "mod_auth_digest"
description: "Module Apache mod_auth_digest — Authentification utilisateur utilisant les condensés MD5. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_auth_digest]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Authentification utilisateur utilisant les condensés MD5 |
| **Statut** | Extension |
| **Identificateur** | `auth_digest_module` |
| **Fichier source** | `mod_auth_digest.c` |

## Sommaire

Ce module implémente l'authentification HTTP basée sur les condensés MD5 ([RFC 2617](https://www.rfc-editor.org/rfc/rfc2617)), et fournit une alternative à [[12-modules/mod_auth_basic|mod_auth_basic]] en ne transmettant plus le mot de passe en clair. Cependant, cela ne suffit pas pour améliorer la sécurité de manière significative par rapport à l'authentification basique. En outre, le stockage du mot de passe sur le serveur est encore moins sûr dans le cas d'une authentification à base de condensé que dans le cas d'une authentification basique. C'est pourquoi l'utilisation de l'authentification basique associée à un chiffrement de la connexion via [[12-modules/mod_ssl|mod_ssl]] constitue une bien meilleure alternative.

## Utilisation de l'authentification à base de condensés

Pour utiliser l'authentification à base de condensés MD5, vous devez simplement remplacer `AuthType Basic` et [[13-directives/authbasicprovider|AuthBasicProvider]] respectivement par `AuthType Digest` et [[13-directives/authdigestprovider|AuthDigestProvider]] lorsque vous configurez l'authentification, puis ajouter une directive [[13-directives/authdigestdomain|AuthDigestDomain]] contenant au moins la(les) URI(s) racine(s) de la zone à protéger.

On peut créer les fichiers utilisateur appropriés (au format texte) à l'aide de l'outil [[10-commandes/htdigest|htdigest]].

**Exemple :**

```apache
<Location "/private/">
    AuthType Digest
    AuthName "private area"
    AuthDigestDomain "/private/" "http://mirror.my.dom/private2/"

    AuthDigestProvider file
    AuthUserFile "/web/auth/.digest_pw"
    Require valid-user
</Location>
```

> [!NOTE]
> **Note**
>
> L'authentification à base de condensé a été conçue pour améliorer la sécurité par rapport à l'authentification basique, mais il s'avère que ce but n'a pas été atteint. Un attaquant de type "man-in-the-middle" peut facilement forcer le navigateur à revenir à une authentification basique. Même une oreille indiscrète passive peut retrouver le mot de passe par force brute avec les moyens modernes, car l'algorithme de hashage utilisé par l'authentification à base de condensé est trop rapide. Autre problème, le stockage des mots de passe sur le serveur n'est pas sûr. Le contenu d'un fichier htdigest volé peut être utilisé directement pour l'authentification à base de condensé. Il est donc fortement recommandé d'utiliser [[12-modules/mod_ssl|mod_ssl]] pour chiffrer la connexion.
>
> [[12-modules/mod_auth_digest|mod_auth_digest]] ne fonctionne correctement que sur les plates-formes où APR supporte la mémoire partagée.

## Directives

- [[13-directives/authdigestprovider|AuthDigestProvider]]
- [[13-directives/authdigestqop|AuthDigestQop]]
- [[13-directives/authdigestnoncelifetime|AuthDigestNonceLifetime]]
- [[13-directives/authdigestalgorithm|AuthDigestAlgorithm]]
- [[13-directives/authdigestdomain|AuthDigestDomain]]
- [[13-directives/authdigestshmemsize|AuthDigestShmemSize]]

## Voir aussi

- [[13-directives/authname|AuthName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

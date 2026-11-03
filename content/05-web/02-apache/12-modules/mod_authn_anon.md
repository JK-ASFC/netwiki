---
title: "mod_authn_anon"
description: "Module Apache mod_authn_anon — Permet un accès \"anonyme\" à des zones protégées. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authn_anon]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet un accès "anonyme" à des zones protégées |
| **Statut** | Extension |
| **Identificateur** | `authn_anon_module` |
| **Fichier source** | `mod_authn_anon.c` |
| **Compatibilité** | Disponible depuis la version 2.1 d'Apache |

## Sommaire

Ce module permet aux frontaux d'authentification comme [[12-modules/mod_auth_basic|mod_auth_basic]] d'authentifier les utilisateurs à la manière des sites FTP anonymes, c'est à dire en fournissant l'identifiant utilisateur spécial 'anonymous' et l'adresse email comme mot de passe. Ces adresses email peuvent être journalisées.

En combinaison avec d'autres méthodes de contrôle d'accès (base de données), ce module permet d'effectuer un véritable suivi des utilisateurs et une personnalisation de leurs accès en fonction de leur profil, tout en conservant l'accessibilité du site aux utilisateurs 'non enregistrés'. Un avantage du suivi des utilisateurs basé sur l'authentification réside dans le fait qu'il est, à l'opposé des cookies magiques et des drôles d'URLs avec préfixes ou suffixes, entièrement indépendant du navigateur et qu'il permet de partager des URLs entre plusieurs utilisateurs.

Si l'on utilise le module [[12-modules/mod_auth_basic|mod_auth_basic]], le module [[12-modules/mod_authn_anon|mod_authn_anon]] est invoqué en affectant la valeur `anon` à la directive [[13-directives/authbasicprovider|AuthBasicProvider]].

## Exemple

L'exemple ci-dessous présente un exemple de combinaison avec l'authentification à base de fichier htpasswd "normale", et permet la connexion d'utilisateurs en tant qu'invités avec les propriétés suivantes :

- Il incite l'utilisateur à fournir un identifiant. ([[13-directives/anonymous-nouserid|Anonymous_NoUserID]])
- Il incite l'utilisateur à fournir un mot de passe. ([[13-directives/anonymous-mustgiveemail|Anonymous_MustGiveEmail]])
- Le mot de passe fourni doit être une adresse email valide, c'est à dire contenant au moins un '@' et un '.'. ([[13-directives/anonymous-verifyemail|Anonymous_VerifyEmail]])
- Les valeurs possibles pour l'identifiant utilisateur sont `anonymous, guest, www, test ou welcome`, et la vérification n'est **pas** sensible à la casse. ([[13-directives/anonymous|Anonymous]])
- Les adresses email entrées dans le champ passwd sont enregistrées dans le fichier journal des erreurs. ([[13-directives/anonymous-logemail|Anonymous_LogEmail]])

**Exemple**

```apache
<Directory "/var/www/html/private">
    AuthName "Use 'anonymous' & Email address for guest entry"
    AuthType Basic
    AuthBasicProvider file anon
    AuthUserFile "/path/to/your/.htpasswd"

    Anonymous_NoUserID off
    Anonymous_MustGiveEmail on
    Anonymous_VerifyEmail on
    Anonymous_LogEmail on
    Anonymous anonymous guest www test welcome

    Require valid-user
</Directory>
```

## Directives

- [[13-directives/anonymous|Anonymous]]
- [[13-directives/anonymous-logemail|Anonymous_LogEmail]]
- [[13-directives/anonymous-mustgiveemail|Anonymous_MustGiveEmail]]
- [[13-directives/anonymous-nouserid|Anonymous_NoUserID]]
- [[13-directives/anonymous-verifyemail|Anonymous_VerifyEmail]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

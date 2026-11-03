---
title: "AuthBasicFake"
description: "Directive Apache AuthBasicFake (mod_auth_basic) — Authentification de base simulée à l'aide des nom d'utilisateur et mot de passe fournis. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_basic]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Authentification de base simulée à l'aide des nom d'utilisateur et mot de passe fournis |
| **Syntaxe** | `AuthBasicFake off\|username [password]` |
| **Valeur par défaut** | `none` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_basic\|mod_auth_basic]] |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache |

## Utilisation

Les nom d'utilisateur et mot de passe spécifiés sont rassemblés dans un en-tête d'autorisation qui est transmis au serveur ou au service sous-jacent au serveur. Ces nom d'utilisateur et mot de passe sont interprétés par l'[[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|interpréteur d'expression]], ce qui permet de les définir en fonction de paramètres de la requête.

Si aucun mot de passe n'est spécifié, la valeur par défaut "password" sera utilisée. Pour désactiver l'authentification de base simulée pour un espace d'URL, définissez AuthBasicFake à "off".

Dans l'exemple suivant, un nom d'utilisateur et un mot de passe prédéfinis sont transmis à un serveur d'arrière-plan :

**Exemple de transmission d'un nom d'utilisateur et d'un mot de passe prédéfinis**

```apache
<Location "/demo">
    AuthBasicFake demo demopass
</Location>
```

Dans l'exemple suivant, l'adresse email extraite d'un certificat client est transmise au serveur, étendant par là-même la fonctionnalité de l'option FakeBasicAuth de la directive [[13-directives/ssloptions|SSLOptions]]. Comme avec l'option FakeBasicAuth, le mot de passe se voit attribué le contenu fixe de la chaîne "password".

**Exemple d'utilisation avec un certificat**

```apache
<Location "/secure">
    AuthBasicFake "%{SSL_CLIENT_S_DN_Email}"
</Location>
```

Pour compléter l'exemple précédent, il est possible de générer la valeur du mot de passe en procédant à un hashage de l'adresse email à partir d'un mot d'une passphrase initial fixée, puis de transmettre le résultat obtenu au serveur d'arrière-plan. Ceci peut s'avérer utile pour donner accès à des serveurs anciens qui ne supportent pas les certificats clients.

**Exemple de génération de mot de passe par hashage de l'adresse email**

```apache
<Location "/secure">
    AuthBasicFake "%{SSL_CLIENT_S_DN_Email}" "%{sha1:passphrase-%{SSL_CLIENT_S_DN_Email}}"
</Location>
```

**Désactivation de l'authentification simulée**

```apache
<Location "/public">
    AuthBasicFake off
</Location>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

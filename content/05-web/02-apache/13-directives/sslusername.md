---
title: "SSLUserName"
description: "Directive Apache SSLUserName (mod_ssl) — Nom de la variable servant à déterminer le nom de l'utilisateur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom de la variable servant à déterminer le nom de l'utilisateur |
| **Syntaxe** | `SSLUserName nom-var` |
| **Contexte** | configuration du serveur, répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette variable permet de définir le champ "user" de l'objet de la requête Apache. Ce champ est utilisé par des modules de plus bas niveau pour identifier l'utilisateur avec une chaîne de caractères. En particulier, l'utilisation de cette directive peut provoquer la définition de la variable d'environnement `REMOTE_USER`. La valeur de l'argument *nom-var* peut correspondre à toute variable d'environnement SSL.

Lorsque l'option `FakeBasicAuth` (voir SSLOptions) ou la directive [[13-directives/authbasicfake|AuthBasicFake]] sont activées, cette directive permet de contrôler quelle partie du certificat client est utilisée comme nom d'utilisateur. Sans la directive `SSLUserName`, `REMOTE_USER` peut ne pas être définie pour d'autres modules ou scripts CGI.

**Exemple**

```apache
SSLUserName SSL_CLIENT_S_DN_CN
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

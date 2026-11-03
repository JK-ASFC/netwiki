---
title: "AuthLDAPURL"
description: "Directive Apache AuthLDAPURL (mod_authnz_ldap) — L'URL permettant de spécifier les paramètres de la recherche LDAP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'URL permettant de spécifier les paramètres de la recherche LDAP |
| **Syntaxe** | `AuthLDAPURL url [NONE\|SSL\|TLS\|STARTTLS]` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |

## Utilisation

Une URL conforme à la RFC 2255 qui permet de spécifier les paramètres à utiliser pour la recherche dans l'annuaire LDAP. La syntaxe de l'URL est :

```
ldap://hôte:port/DN-de-base?attribut?portée?filtre
```

Si vous souhaitez mettre à la disposition d'Apache plusieurs URLs LDAP, la syntaxe sera :

```apache
AuthLDAPURl "ldap://ldap1.example.com ldap2.example.com/dc=..."
```

> [!WARNING]
> **Mise en garde**
>
> Si vous spécifiez plusieurs serveurs, vous devez en entourer la liste avec des guillemets ; dans le cas contraire, vous générerez une erreur : "AuthLDAPURL takes one argument, URL to define LDAP connection..". Vous pouvez bien entendu ajouter des paramètres de recherche à chacun des serveurs spécifiés.

**ldap**

Pour ldap non sécurisé, utilisez la chaîne `ldap`. Pour ldap sécurisé, utilisez à la place la chaîne `ldaps`. LDAP sécurisé n'est disponible que si Apache a été lié avec une bibliothèque LDAP supportant SSL.

**hôte:port**

Il s'agit du nom/port du serveur ldap (dont la valeur par défaut est `localhost:389` pour `ldap`, et `localhost:636` pour `ldaps`). Pour spécifier plusieurs serveurs LDAP redondants, indiquez simplement leur liste en les séparant par des espaces. [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] tentera alors de se connecter à chacun des serveurs jusqu'à ce qu'il parvienne à se connecter avec succès. Notez qu'en cas de multiples serveurs LDAP, l'ensemble de l'URL LDAP doit être entourée de guillemets.

lorsqu'une connection a été établie avec un serveur, elle reste active pendant toute la durée de vie du processus [[10-commandes/httpd|httpd]], ou jusqu'à ce que le serveur LDAP cesse de fonctionner.

Si le serveur LDAP cesse de fonctionner, et ainsi interrompt une connexion existante, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] tentera de se reconnecter en commençant par le premier serveur de la liste, et ainsi de suite avec les serveurs redondants suivants. Notez que ce processus n'a rien à voir avec une véritable recherche de type round-robin.

**DN-de-base**

Le DN de la branche de l'annuaire à partir de laquelle toutes les recherches seront lancées. Il doit au moins correspondre à la racine de votre annuaire, mais vous pouvez aussi indiquer une branche plus spécifique.

**attribut**

Il s'agit de l'attribut à utiliser pour la recherche. Bien que la RFC 2255 autorise une liste d'attributs séparés par des virgules, seul le premier sera retenu, sans tenir compte des autres attributs fournis. Si aucun attribut n'est fourni, l'attribut par défaut est `uid`. Il est judicieux de choisir un attribut dont la valeur sera unique parmi toutes les entrées de la branche de l'annuaire que vous aurez définie. Tous les attributs spécifiés seront enregistrés dans des variables d'environnement avec le préfixe AUTHENTICATE\_, afin de pouvoir être utilisés par d'autres modules.

**portée**

Il s'agit de la portée de la recherche. Elle peut prendre les valeurs `one` ou `sub`. Notez que la RFC 2255 supporte aussi une portée de valeur `base`, mais cette dernière n'est pas supportée par le module. Si la portée n'est pas définie, ou si elle est définie à `base`, c'est la valeur de portée par défaut `sub` qui sera utilisée.

**filtre**

Il s'agit d'un filtre de recherche LDAP valide. Si aucun filtre n'est spécifié, le filtre par défaut `(objectClass=*)` sera utilisé, ce qui corrspond à une recherche de tous les types d'objets de l'arborescence. La taille des filtres est limitée à environ 8000 caractères (valeur de la macro `MAX_STRING_LEN` dans le code source d'Apache), ce qui s'avère plus que suffisant pour la plupart des applications. Depuis la version 2.4.10, il est possible d'utiliser le paramètre `none` pour spécifier qu'aucun filtre n'est activé ; ce paramètre est obligatoire avec certains serveurs LDAP primitifs.

Pour une recherche, les attribut, filtre et nom d'utilisateur fournis par le client HTTP sont combinés pour créer un filtre de recherche du style : `(&(filtre)(attribut =nom-utilisateur))`.

Par exemple, considérons l'URL `ldap://ldap.example.com/o=Example?cn?sub?(posixid=*)`. Lorsqu'un client tentera de se connecter en utilisant le nom d'utilisateur `Babs Jenson`, le filtre de recherche sera : `(&(posixid=*)(cn=Babs Jenson))`.

On peut encore ajouter un paramètre optionnel pour permettre à l'URL LDAP de surcharger le type de connexion. Ce paramètre peut prendre l'une des valeurs suivantes :

**NONE**

Établit une connexion non sécurisée sur le port LDAP par défaut, ce qui est équivalent à `ldap://` sur le port 389.

**SSL**

Établit une connexion sécurisée sur le port LDAP sécurisé par défaut, ce qui est équivalent à `ldaps://`.

**TLS | STARTTLS**

Établit une connexion sécurisée par élévation de niveau sur le port LDAP par défaut. Cette connexion sera initialisée sur le port 389 par défaut, puis élevée à un niveau de connexion sécurisée sur le même port.

Voir plus haut pour des exemples d'URLs définies par la directive [[13-directives/authldapurl|AuthLDAPURl]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

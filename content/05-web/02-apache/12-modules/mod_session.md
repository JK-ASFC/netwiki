---
title: "mod_session"
description: "Module Apache mod_session — Support des sessions. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_session]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Support des sessions |
| **Statut** | Extension |
| **Identificateur** | `session_module` |
| **Fichier source** | `mod_session.c` |
| **Compatibilité** | Disponible depuis la version 2.3 d'Apache |

## Sommaire

> [!WARNING]
> **Avertissement**
>
> Le module session fait usage des cookies HTTP, et peut à ce titre être victime d'attaques de type Cross Site Scripting, ou divulguer des informations à caractère privé aux clients. Veuillez vous assurer que les risques ainsi encourus ont été pris en compte avant d'activer le support des sessions sur votre serveur.

Ce module fournit le support d'une interface de session pour chaque utilisateur au niveau du serveur global. Les sessions permettent de transmettre diverses informations : l'utilisateur est-il connecté ou non, ou toute autre information qui doit être conservée d'une requête à l'autre.

Les sessions peuvent être stockées sur le serveur, ou au niveau du navigateur. Les sessions peuvent également être chiffrées pour une sécurité accrue. Ces fonctionnalités sont réparties entre différents modules complémentaires de [[12-modules/mod_session|mod_session]] : [[12-modules/mod_session_crypto|mod_session_crypto]], [[12-modules/mod_session_cookie|mod_session_cookie]] et [[12-modules/mod_session_dbd|mod_session_dbd]]. Chargez les modules appropriés en fonction des besoins du serveur (soit statiquement à la compilation, soit dynamiquement via la directive [[13-directives/loadmodule|LoadModule]]).

Les sessions peuvent être manipulées par d'autres modules qui dépendent de la session, ou la session peut être lue et écrite dans des variables d'environnement et des en-têtes HTTP, selon les besoins.

## Qu'est-ce qu'une session ?

Au coeur de l'interface de session se trouve une table de paires clé/valeur qui sont accessibles d'une requête du navigateur à l'autre. Les valeurs de clés peuvent se voir affecter toute chaîne de caractères valide, en fonction des besoins de l'application qui fait usage de la session.

Une "session" est une chaîne **application/x-www-form-urlencoded** qui contient la paire clé/valeur définie par la [spécification HTML](http://www.w3.org/TR/html4/).

Selon les souhaits de l'administrateur, la session peut être chiffrée et codée en base64 avant d'être soumise au dispositif de stockage.

## Qui peut utiliser une session ?

L'interface de session a été conçue à l'origine pour être utilisée par d'autres modules du serveur comme [[12-modules/mod_auth_form|mod_auth_form]] ; les applications à base de programmes CGI peuvent cependant se voir accorder l'accès au contenu d'une session via la variable d'environnement HTTP\_SESSION. Il est possible de modifier et/ou de mettre à jour une session en insérant un en-tête de réponse HTTP contenant les nouveaux paramètres de session.

## Stockage des sessions sur le serveur

Apache peut être configuré pour stocker les sessions utilisateurs sur un serveur particulier ou un groupe de serveurs. Cette fonctionnalité est similaire aux sessions disponibles sur les serveurs d'applications courants.

Selon la configuration, les sessions sont suivies à partir d'un identifiant de session stocké dans un cookie, ou extraites de la chaîne de paramètres de l'URL, comme dans les requêtes GET courantes.

Comme le contenu de la session est stocké exclusivement sur le serveur, il est nécessaire de préserver la confidentialité de ce contenu. Ceci a des implications en matière de performance et de consommation de ressources lorsqu'un grand nombre de sessions est stocké, ou lorsqu'un grand nombre de serveurs doivent se partager les sessions entre eux.

Le module [[12-modules/mod_session_dbd|mod_session_dbd]] permet de stocker les sessions utilisateurs dans une base de données SQL via le module [[12-modules/mod_dbd|mod_dbd]].

## Stockage des sessions au niveau du navigateur

Dans les environnements à haut trafic où le stockage d'une session sur un serveur consomme trop de ressources, il est possible de stocker le contenu de la session dans un cookie au niveau du navigateur client.

Ceci a pour avantage de ne nécessiter qu'une quantité minimale de ressources sur le serveur pour suivre les sessions, et évite à plusieurs serveurs parmi une forêt de serveurs de devoir partager les informations de session.

Le contenu de la session est cependant présenté au client, avec pour conséquence un risque de perte de confidentialité. Le module [[12-modules/mod_session_crypto|mod_session_crypto]] peut être configuré pour chiffrer le contenu de la session avant qu'elle soit stockée au niveau du client.

Le module [[12-modules/mod_session_cookie|mod_session_cookie]] permet de stocker les sessions au niveau du navigateur dans un cookie HTTP.

## Exemples simples

La création d'une session consiste simplement à ouvrir la session, et à décider de l'endroit où elle doit être stockée. Dans l'exemple suivant, la session sera stockée au niveau du navigateur, dans un cookie nommé `session`.

**Session stockée au niveau du navigateur**

```apache
Session On
SessionCookieName session path=/
```

Une session est inutile s'il n'est pas possible d'y lire ou d'y écrire. L'exemple suivant montre comment des valeurs peuvent être injectées dans une session à l'aide d'un en-tête de réponse HTTP prédéterminé nommé `X-Replace-Session`.

**Ecriture dans une session**

```apache
Session On
SessionCookieName session path=/
SessionHeader X-Replace-Session
```

L'en-tête doit contenir des paires clé/valeur sous le même format que celui de la chaîne d'argument d'une URL, comme dans l'exemple suivant. Donner pour valeur à une clé la chaîne vide a pour effet de supprimer la clé de la session.

**Script CGI pour écrire dans une session**

```bash
#!/bin/bash
echo "Content-Type: text/plain"
echo "X-Replace-Session: key1=foo&key2=&key3=bar"
echo
env
```

Selon la configuration, les informations de la session peuvent être extraites de la variable d'environnement HTTP\_SESSION. Par défaut la session est privée, et cette fonctionnalité doit donc être explicitement activée via la directive [[13-directives/sessionenv|SessionEnv]].

**Lecture depuis une session**

```apache
Session On
SessionEnv On
SessionCookieName session path=/
SessionHeader X-Replace-Session
```

Une fois la lecture effectuée, la variable CGI `HTTP_SESSION` doit contenir la valeur `clé1=foo&clé3=bar`.

## Confidentialité des sessions

En utilisant la fonctionnalité de votre navigateur "Afficher les cookies", vous pouvez voir une réprésentation de la session sous forme de texte en clair. Ceci peut poser problème si le contenu de la session doit être dissimulé à l'utilisateur final, ou si un tiers accède sans autorisation aux informations de session.

À ce titre, le contenu de la session peut être chiffré à l'aide du module [[12-modules/mod_session_crypto|mod_session_crypto]] avant d'être stocké au niveau du navigateur.

**Session chiffrée avant stockage au niveau du navigateur**

```apache
Session On
SessionCryptoPassphrase secret
SessionCookieName session path=/
```

La session sera automatiquement déchiffrée à la lecture, et rechiffrée par Apache lors de la sauvegarde, si bien que l'application sous-jacente qui utilise la session n'a pas à se préoccuper de savoir si un chiffrement a été mis en oeuvre ou non.

Les sessions stockées sur le serveur plutôt qu'au niveau du navigateur peuvent aussi être chiffrées, préservant par là-même la confidentialité lorsque des informations sensibles sont partagées entre les serveurs web d'une forêt de serveurs à l'aide du module [[12-modules/mod_session_dbd|mod_session_dbd]].

## Confidentialité du cookie

Le mécanisme de cookie HTTP offre aussi des fonctionnalités quant à la confidentialité, comme la possibilité de restreindre le transport du cookie aux pages protégées par SSL seulement, ou l'interdiction pour les scripts java qui s'exécutent au niveau du navigateur d'obtenir l'accès au contenu du cookie.

> [!WARNING]
> **Avertissement**
>
> Certaines fonctionnalités de confidentialité du cookie HTTP ne sont pas standardisées, ou ne sont pas toujours implémentées au niveau du navigateur. Les modules de session vous permettent de définir les paramètres du cookie, mais il n'est pas garanti que la confidentialité sera respectée par le navigateur. Si la sécurité est la principale préoccupation, chiffrez le contenu de la session avec le module [[12-modules/mod_session_crypto|mod_session_crypto]], ou stockez la session sur le serveur avec le module [[12-modules/mod_session_dbd|mod_session_dbd]].

Les paramètres standards du cookie peuvent être spécifiés après le nom du cookie comme dans l'exemple suivant :

**Définition des paramètres du cookie**

```apache
Session On
SessionCryptoPassphrase secret
SessionCookieName session path=/private;domain=example.com;httponly;secure;
```

Dans les cas où le serveur Apache sert de frontal pour des serveurs d'arrière-plan, il est possible de supprimer les cookies de session des en-têtes HTTP entrants à l'aide de la directive [[13-directives/sessioncookieremove|SessionCookieRemove]]. Ceci permet d'empêcher les serveurs d'arrière-plan d'accéder au contenu des cookies de session.

## Support des sessions pour l'authentification

Comme il est possible de le faire avec de nombreux serveurs d'applications, les modules d'authentification peuvent utiliser une session pour stocker le nom d'utilisateur et le mot de passe après connexion. Le module [[12-modules/mod_auth_form|mod_auth_form]] par exemple, sauvegarde les nom de connexion et mot de passe de l'utilisateur dans une session.

**Authentification à base de formulaire**

```apache
Session On
SessionCryptoPassphrase secret
SessionCookieName session path=/
AuthFormProvider file
AuthUserFile "conf/passwd"
AuthType form
AuthName "realm"
#...
```

Pour la documentation et des exemples complets, voir le module [[12-modules/mod_auth_form|mod_auth_form]].

## Intégration des sessions avec les applications externes

Pour que les sessions soient utiles, leur contenu doit être accessible aux applications externes, et ces dernières doivent elles-mêmes être capables d'écrire une session.

L'exemple type est une application qui modifie le mot de passe d'un utilisateur défini par [[12-modules/mod_auth_form|mod_auth_form]]. Cette application doit pouvoir extraire les nom d'utilisateur et mot de passe courants de la session, effectuer les modifications demandées, puis écrire le nouveau mot de passe dans la session, afin que la transition vers le nouveau mot de passe soit transparente.

Un autre exemple met en jeu une application qui enregistre un nouvel utilisateur pour la première fois. Une fois l'enregistrement terminé, le nom d'utilisateur et le mot de passe sont écrits dans la session, fournissant là aussi une transition transparente.

**Modules Apache**

Selon les besoins, les modules du serveur peuvent utiliser l'API **mod\_session.h** pour lire et écrire dans les sessions. Les modules tels que [[12-modules/mod_auth_form|mod_auth_form]] utilisent ce mécanisme.

**Programmes CGI et langages de script**

Les applications qui s'exécutent au sein du serveur web peuvent éventuellement extraire la valeur de la session de la variable d'environnement **HTTP\_SESSION**. La session doit être codée sous la forme d'une chaîne **application/x-www-form-urlencoded** selon les préconisations de la [specification HTML](http://www.w3.org/TR/html4/). Cette variable d'environnement est définie via la directive [[13-directives/sessionenv|SessionEnv]]. Un script peut écrire dans la session en renvoyant un en-tête de réponse **application/x-www-form-urlencoded** dont le nom est défini via la directive [[13-directives/sessionheader|SessionHeader]]. Dans les deux cas, tout chiffrement ou déchiffrement, ainsi que la lecture ou l'écriture de ou vers la session à partir du mécanisme de stockage choisi sont gérés par le module [[12-modules/mod_session|mod_session]] et la configuration correspondante.

**Applications situées derrière [[12-modules/mod_proxy|mod_proxy]]**

Si la directive [[13-directives/sessionheader|SessionHeader]] est utilisée pour définir un en-tête de requête HTTP, la session codée sous la forme d'une chaîne **application/x-www-form-urlencoded** sera accessible pour l'application. Si ce même en-tête est fourni dans la réponse, sa valeur sera utilisée pour remplacer la session. Comme précédemment, tout chiffrement ou déchiffrement, ainsi que la lecture ou l'écriture de ou vers la session à partir du mécanisme de stockage choisi sont gérés par le module [[12-modules/mod_session|mod_session]] et la configuration correspondante.

**Applications indépendantes**

Les applications peuvent choisir de manipuler la session en s'affranchissant du contrôle du serveur HTTP Apache. Dans ce cas, c'est l'application qui doit prendre en charge la lecture de la session depuis le mécanisme de stockage choisi, son déchiffrement, sa mise à jour, son chiffrement et sa réécriture vers le mécanisme de stockage choisi de manière appropriée.

## Directives

- [[13-directives/session|Session]]
- [[13-directives/sessionmaxage|SessionMaxAge]]
- [[13-directives/sessionenv|SessionEnv]]
- [[13-directives/sessionheader|SessionHeader]]
- [[13-directives/sessioninclude|SessionInclude]]
- [[13-directives/sessionexclude|SessionExclude]]
- [[13-directives/sessionexpiryupdateinterval|SessionExpiryUpdateInterval]]

## Voir aussi

- [[12-modules/mod_session_cookie|mod_session_cookie]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

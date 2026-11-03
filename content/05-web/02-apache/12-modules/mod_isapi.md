---
title: "mod_isapi"
description: "Module Apache mod_isapi — Extensions ISAPI dans Apache pour Windows. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_isapi]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Extensions ISAPI dans Apache pour Windows |
| **Statut** | Base |
| **Identificateur** | `isapi_module` |
| **Fichier source** | `mod_isapi.c` |
| **Compatibilité** | Win32 only |

## Sommaire

Ce module implémente l'API des extensions du Serveur Internet. Il permet à Apache pour Windows de servir les extensions du Serveur Internet (par exemple les modules .dll ISAPI), compte tenu des restrictions spécifiées.

Les modules d'extension ISAPI (fichiers .dll) sont des modules tiers. Leur auteur n'est pas le Groupe Apache, et nous n'assurons donc pas leur support. Veuillez contacter directement l'auteur d'ISAPI si vous rencontrez des problèmes à l'exécution d'une extension ISAPI. **Merci de *ne pas* soumettre ce genre de problème dans les listes d'Apache ou dans les pages de rapports de bogues.**

## Utilisation

Dans le fichier de configuration du serveur, utilisez la directive [[13-directives/addhandler|AddHandler]] pour associer les fichiers ISAPI au gestionnaire `isapi-handler` à l'aide de l'extension de leur nom de fichier. Pour faire en sorte que tout fichier .dll soit traité en tant qu'extension ISAPI, éditez le fichier httpd.conf et ajoutez les lignes suivantes :

```apache
AddHandler isapi-handler .dll
```

> [!NOTE]
> Dans les versions plus anciennes du serveur Apache, le nom du gestionnaire était `isapi-isa` au lieu de `isapi-handler`. Depuis les versions de développement 2.3 du serveur Apache, `isapi-isa` n'est plus valide, et vous devrez éventuellement modifier votre configuration pour utiliser `isapi-handler` à la place.

Le serveur Apache ne propose aucun moyen de conserver en mémoire un module chargé. Vous pouvez cependant précharger et garder un module spécifique en mémoire en utilisant la syntaxe suivante dans votre httpd.conf :

```apache
ISAPICacheFile c:/WebWork/Scripts/ISAPI/mytest.dll
```

Que vous ayez ou non préchargé une extension ISAPI, ces dernières sont toutes soumises au mêmes restrictions et possèdent les mêmes permissions que les scripts CGI. En d'autres termes, [[13-directives/options|Options]] `ExecCGI` doit être défini pour le répertoire qui contient le fichier .dll ISAPI.

Reportez-vous aux Notes additionnelles et au Journal du programmeur pour plus de détails et une clarification à propos du support spécifique ISAPI fourni par le module [[12-modules/mod_isapi|mod_isapi]].

## Notes additionnelles

L'implémentation ISAPI d'Apache se conforme à toutes les spécifications ISAPI 2.0, à l'exception de certaines extensions "spécifiques Microsoft" utilisant des entrées/sorties asynchrones. Le modèle des entrées/sorties d'Apache ne permet pas l'écriture et la lecture asynchrone de la manière dont ISAPI pourrait le faire. Si une extension tente d'utiliser des fonctionnalités non supportées, comme les entrées/sorties asynchrones, un message est enregistré dans le journal des erreurs afin d'aider au débogage. Comme ces messages peuvent devenir envahissants, la directive `ISAPILogNotSupported Off` permet de filter ce bruit de fond.

Si aucune option de configuration particulière n'est spécifiée, certains serveurs, comme Microsoft IIS, chargent l'extension ISAPI dans le serveur et la conservent en mémoire jusqu'à ce que l'utilisation de cette dernière devienne trop élevée. Apache, par contre, charge et décharge réellement l'extension ISAPI chaque fois qu'elle est invoquée, si la directive [[13-directives/isapicachefile|ISAPICacheFile]] n'a pas été spécifiée. Ce n'est pas très performant, mais le modèle de mémoire d'Apache fait que cette méthode est la plus efficace. De nombreux modules ISAPI présentent des incompatibilités subtiles avec le serveur Apache, et le déchargement de ces modules permet d'assurer la stabilité du serveur.

En outre, gardez à l'esprit que si Apache supporte les extensions ISAPI, il **ne supporte pas les filtres ISAPI**. Le support des filtres sera peut-être ajouté dans le futur, mais n'a pas encore été planifié.

## Journal du programmeur

Si vous écrivez des modules [[12-modules/mod_isapi|mod_isapi]] Apache 2.0, vous devez limiter vos appels à `ServerSupportFunction` aux directives suivantes :

**`HSE_REQ_SEND_URL_REDIRECT_RESP`**

Redirige l'utilisateur vers une autre adresse.
Il doit s'agir d'une URL pleinement qualifiée (comme `http://serveur/chemin`).

**`HSE_REQ_SEND_URL`**

Redirige l'utilisateur vers une autre adresse.
Ce ne doit pas être une URL pleinement qualifiée ; la mention du protocole ou du nom du serveur n'est pas autorisée (par exemple, utilisez simplement `/chemin`).
La redirection n'est pas assurée par le navigateur mais par le serveur lui-même.

> [!WARNING]
> **Avertissement**
>
> Dans sa documentation récente, Microsoft semble avoir abandonné la distinction entre les deux fonctions `HSE_REQ_SEND_URL`. Apache, quant à lui, continue de les traiter comme deux fonctions distinctes avec des contraintes et des comportements spécifiques.

**`HSE_REQ_SEND_RESPONSE_HEADER`**

Apache accepte un corps de réponse après l'en-tête s'il se situe après la ligne vide (deux caractères newline consécutifs) dans la chaîne des arguments d'en-têtes. Ce corps ne doit pas contenir de caractères NULL, car l'argument des en-têtes est lui-même terminé par un caractère NULL.

**`HSE_REQ_DONE_WITH_SESSION`**

Apache considère ceci comme sans objet, car la session est fermée lorsque l'extension ISAPI termine son traitement.

**`HSE_REQ_MAP_URL_TO_PATH`**

Apache va traduire un nom virtuel en nom physique.

**`HSE_APPEND_LOG_PARAMETER`**

Ce paramètre peut intervenir dans un de ces journaux :

- dans le composant `\"%{isapi-parameter}n\"` d'une directive [[13-directives/customlog|CustomLog]]
- dans le composant `%q` avec la directive [[13-directives/isapiappendlogtoquery|ISAPIAppendLogToQuery]] `On`
- dans le journal des erreurs avec la directive [[13-directives/isapiappendlogtoerrors|ISAPIAppendLogToErrors]] `On`

La première option, le composant `%{isapi-parameter}n`, est préférable et toujours disponible.

**`HSE_REQ_IS_KEEP_CONN`**

retourne le statut négocié Keep-Alive.

**`HSE_REQ_SEND_RESPONSE_HEADER_EX`**

se comportera comme indiqué dans le documentation, bien que le drapeau `fKeepConn` soit ignoré.

**`HSE_REQ_IS_CONNECTED`**

renverra faux si la requête a été abandonnée.

Apache renvoie `FALSE` pour tout appel non supporté à `ServerSupportFunction`, et `GetLastError` renverra la valeur `ERROR_INVALID_PARAMETER`.

`ReadClient` extrait la partie du corps de la requête qui dépasse le tampon initial (défini par la directive [[13-directives/isapireadaheadbuffer|ISAPIReadAheadBuffer]]). En fonction de la définition de la directive `ISAPIReadAheadBuffer` (nombre d'octets à mettre dans le tampon avant d'appeler le gestionnaire ISAPI), les requêtes courtes sont envoyées en entier à l'extension lorsque celle-ci est invoquée. Si la taille de la requête est trop importante, l'extension ISAPI doit faire appel à `ReadClient` pour extraire la totalité du corps de la requête.

`WriteClient` est supporté, mais seulement avec le drapeau `HSE_IO_SYNC` ou le drapeau "aucune option" (valeur `0`). Toute autre requête `WriteClient` sera rejetée avec une valeur de retour `FALSE`, et `GetLastError` renverra la valeur `ERROR_INVALID_PARAMETER`

`GetServerVariable` est supporté, bien que les variables étendues de serveur n'existent pas (comme défini par d'autres serveurs). Toutes les variables d'environnement CGI usuelles d'Apache sont disponibles à partir de `GetServerVariable`, ainsi que les valeurs `ALL_HTTP` et `ALL_RAW`.

Depuis httpd 2.0, [[12-modules/mod_isapi|mod_isapi]] propose des fonctionnalités supplémentaires introduites dans les versions actualisées de la spécification ISAPI, ainsi qu'une émulation limitée des entrées/sorties asynchrones et la sémantique `TransmitFile`. Apache httpd supporte aussi le préchargement des .dlls ISAPI à des fins de performances.

## Directives

- [[13-directives/isapicachefile|ISAPICacheFile]]
- [[13-directives/isapireadaheadbuffer|ISAPIReadAheadBuffer]]
- [[13-directives/isapilognotsupported|ISAPILogNotSupported]]
- [[13-directives/isapiappendlogtoerrors|ISAPIAppendLogToErrors]]
- [[13-directives/isapiappendlogtoquery|ISAPIAppendLogToQuery]]
- [[13-directives/isapifakeasync|ISAPIFakeAsync]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

---
title: "Noms de serveurs"
description: "Nginx — Noms de serveurs. Les noms de serveurs se définissent avec la directive server_name et déterminent quel bloc server traite une requête donnée. Voir aussi « Comment nginx traite une requête ». Ils peuvent être définis par des noms exacts,…"
tags: [nginx, guide]
icon: book-open
---

Les noms de serveurs se définissent avec la directive [[12-directives/server-name-http-core|server_name]] et déterminent quel bloc [[12-directives/server-http-core|server]] traite une requête donnée. Voir aussi « [[10-guides/02-http/request-processing|Comment nginx traite une requête]] ». Ils peuvent être définis par des noms exacts, des noms génériques ou des expressions régulières :

```
server {
    listen       80;
    server_name  example.org  www.example.org;
    ...
}

server {
    listen       80;
    server_name  *.example.org;
    ...
}

server {
    listen       80;
    server_name  mail.*;
    ...
}

server {
    listen       80;
    server_name  ~^(?<user>.+)\.example\.net$;
    ...
}
```

La recherche s'effectue dans l'ordre de priorité suivant et s'arrête à la première variante correspondante :

1. le nom exact
2. le plus long nom générique commençant par un astérisque, par exemple « `*.example.org` »
3. le plus long nom générique se terminant par un astérisque, par exemple « `mail.*` »
4. la première expression régulière correspondante (dans l'ordre d'apparition dans le fichier de configuration)

## Noms génériques

Un nom générique ne peut contenir un astérisque qu'au début ou à la fin du nom, et seulement à la limite d'un point. Les noms « `www.*.example.org` » et « `w*.example.org` » ne sont pas valides ; ils peuvent toutefois s'écrire avec des expressions régulières, par exemple « `~^www\..+\.example\.org$` » et « `~^w.*\.example\.org$` ». Un astérisque peut correspondre à plusieurs parties du nom : « `*.example.org` » correspond à `www.example.org` mais aussi à `www.sub.example.org`.

Le nom générique spécial de la forme « `.example.org` » correspond à la fois au nom exact « `example.org` » et au nom générique « `*.example.org` ».

## Noms en expressions régulières

Les expressions régulières de nginx sont compatibles avec celles du langage Perl (PCRE). Pour utiliser une expression régulière, le nom de serveur doit commencer par un tilde :

```c
server_name  ~^www\d+\.example\.net$;
```

sinon il est traité comme un nom exact ou, s'il contient un astérisque, comme un nom générique (très probablement non valide). N'oubliez pas les ancres « `^` » et « `$` » : elles ne sont pas obligatoires syntaxiquement, mais logiquement. Les points des noms de domaine doivent aussi être échappés par une barre oblique inverse. Une expression régulière contenant les caractères « `{` » et « `}` » doit être placée entre guillemets :

```c
server_name  "~^(?<name>\w\d{1,3}+)\.example\.net$";
```

sinon nginx ne démarre pas et affiche le message d'erreur :

```
directive "server_name" is not terminated by ";" in ...
```

Une capture nommée d'expression régulière peut ensuite servir de variable :

```
server {
    server_name   ~^(www\.)?(?<domain>.+)$;

    location / {
        root   /sites/$domain;
    }
}
```

Les captures peuvent aussi être utilisées sous forme positionnelle :

```
server {
    server_name   ~^(www\.)?(.+)$;

    location / {
        root   /sites/$2;
    }
}
```

Cet usage doit toutefois être réservé aux cas simples (comme ci-dessus), car les captures positionnelles sont facilement écrasées par d'autres expressions régulières. Voir « [[10-guides/01-introduction/regex-captures|Captures des expressions régulières]] » pour la syntaxe des captures nommées et la durée de disponibilité des valeurs capturées.

## Noms divers

Certains noms de serveurs sont traités de façon particulière.

Pour traiter les requêtes sans champ d'en-tête `Host` dans un bloc [[12-directives/server-http-core|server]] qui n'est pas celui par défaut, il faut indiquer un nom vide :

```
server {
    listen       80;
    server_name  example.org  www.example.org  "";
    ...
}
```

Si aucun [[12-directives/server-name-http-core|server_name]] n'est défini dans un bloc [[12-directives/server-http-core|server]], nginx utilise le nom vide comme nom de serveur.

> [!NOTE]
> Jusqu'à la version 0.8.48, nginx utilisait dans ce cas le nom d'hôte de la machine.

Si un nom de serveur vaut « `$hostname` » (0.9.4), le nom d'hôte de la machine est utilisé.

Si une requête utilise une adresse IP au lieu d'un nom de serveur, le champ d'en-tête de requête `Host` contient l'adresse IP, et la requête peut être traitée en utilisant l'adresse IP comme nom de serveur :

```
server {
    listen       80;
    server_name  example.org
                 www.example.org
                 ""
                 192.168.1.1
                 ;
    ...
}
```

Dans les exemples de serveur « attrape-tout », on voit l'étrange nom « `_` » :

```
server {
    listen       80  default_server;
    server_name  _;
    return       444;
}
```

Ce nom n'a rien de particulier : c'est un nom de domaine non valide parmi une infinité d'autres, qui ne croisent jamais un nom réel. D'autres noms non valides comme « `--` » et « `!@#` » conviennent tout autant.

Jusqu'à la version 0.6.25, nginx prenait en charge le nom spécial « `*` », interprété à tort comme un nom attrape-tout. Il n'a jamais fonctionné comme nom attrape-tout ni comme nom générique : il fournissait la fonction aujourd'hui assurée par la directive [[12-directives/server-name-in-redirect|server_name_in_redirect]]. Le nom spécial « `*` » est obsolète ; utilisez la directive [[12-directives/server-name-in-redirect|server_name_in_redirect]]. Il n'existe aucun moyen de désigner le nom attrape-tout ou le serveur par défaut avec la directive [[12-directives/server-name-http-core|server_name]] : c'est une propriété de la directive [[12-directives/listen-http-core|listen]], et non de [[12-directives/server-name-http-core|server_name]]. Voir aussi « [[10-guides/02-http/request-processing|Comment nginx traite une requête]] ». On peut définir des serveurs écoutant sur les ports \*:80 et \*:8080, et faire de l'un le serveur par défaut du port \*:8080 et de l'autre celui du port \*:80 :

```
server {
    listen       80;
    listen       8080  default_server;
    server_name  example.net;
    ...
}

server {
    listen       80  default_server;
    listen       8080;
    server_name  example.org;
    ...
}
```

## Noms internationalisés

Les noms de domaine internationalisés ([IDN](https://en.wikipedia.org/wiki/Internationalized_domain_name)) doivent être indiqués sous leur forme ASCII (Punycode) dans la directive [[12-directives/server-name-http-core|server_name]] :

```
server {
    listen       80;
    server_name  xn--e1afmkfd.xn--80akhbyknj4f;  # пример.испытание
    ...
}
```

## Choix du serveur virtuel

Une connexion est d'abord créée dans le contexte d'un serveur par défaut. Le nom de serveur peut ensuite être déterminé aux étapes suivantes du traitement de la requête, chacune intervenant dans le choix de la configuration du serveur :

- pendant la négociation SSL, par anticipation, selon [[10-guides/02-http/configuring-https-servers|SNI]]
- après le traitement de la ligne de requête
- après le traitement du champ d'en-tête `Host`
- si le nom de serveur n'a pas été déterminé par la ligne de requête ni par le champ `Host`, nginx utilise le nom vide comme nom de serveur.

À chacune de ces étapes, des configurations de serveur différentes peuvent s'appliquer. Certaines directives doivent donc être indiquées avec précaution :

- pour la directive [[12-directives/ssl-protocols-http-ssl|ssl_protocols]], la liste des protocoles d'un serveur virtuel ne peut s'appliquer que si la bibliothèque sous-jacente le permet (OpenSSL 1.1.1 ou plus récent, BoringSSL, AWS-LC). Avec les autres bibliothèques, la liste des protocoles est fixée avant que la configuration du serveur puisse s'appliquer selon SNI : les protocoles ne doivent alors être indiqués que pour le serveur par défaut ;
- pour les directives [[12-directives/ssl-session-cache-http-ssl|ssl_session_cache]], [[12-directives/ssl-session-tickets-http-ssl|ssl_session_tickets]], [[12-directives/ssl-session-timeout-http-ssl|ssl_session_timeout]] et, par conséquent, [[12-directives/ssl-early-data|ssl_early_data]], les sessions SSL sont toujours reprises depuis le contexte du serveur par défaut : ces directives ne doivent donc être indiquées que pour le serveur par défaut ;
- les directives [[12-directives/client-header-buffer-size|client_header_buffer_size]] et [[12-directives/merge-slashes|merge_slashes]] interviennent avant la lecture de la ligne de requête : elles utilisent la configuration du serveur par défaut ou celle choisie selon SNI ;
- pour les directives [[12-directives/ignore-invalid-headers|ignore_invalid_headers]], [[12-directives/large-client-header-buffers|large_client_header_buffers]] et [[12-directives/underscores-in-headers|underscores_in_headers]], qui interviennent dans le traitement des champs d'en-tête, cela dépend en outre de la mise à jour éventuelle de la configuration du serveur selon la ligne de requête ou le champ `Host` ;
- une réponse d'erreur est traitée par la directive [[12-directives/error-page|error_page]] du serveur qui traite la requête à ce moment.

## Optimisation

Les noms exacts, les noms génériques commençant par un astérisque et ceux se terminant par un astérisque sont stockés dans trois tables de hachage liées aux ports d'écoute. Leurs tailles sont optimisées lors de la configuration pour qu'un nom soit trouvé avec le moins possible de défauts de cache processeur. Le réglage des tables de hachage est détaillé dans un [[10-guides/01-introduction/hash|document distinct]].

La table des noms exacts est consultée en premier. Si le nom n'y est pas, c'est la table des noms génériques commençant par un astérisque, puis celle des noms génériques se terminant par un astérisque.

La recherche dans les tables de noms génériques est plus lente que dans celle des noms exacts, car les noms sont recherchés par parties du domaine. La forme spéciale « `.example.org` » est stockée dans une table de noms génériques et non dans celle des noms exacts.

Les expressions régulières sont testées l'une après l'autre : c'est la méthode la plus lente, et elle ne passe pas à l'échelle.

Il vaut donc mieux utiliser des noms exacts quand c'est possible. Par exemple, si les noms les plus demandés d'un serveur sont `example.org` et `www.example.org`, il est plus efficace de les définir explicitement :

```
server {
    listen       80;
    server_name  example.org  www.example.org  *.example.org;
    ...
}
```

que d'utiliser la forme simplifiée :

```
server {
    listen       80;
    server_name  .example.org;
    ...
}
```

Si un grand nombre de noms de serveurs, ou des noms particulièrement longs, sont définis, il peut devenir nécessaire d'ajuster les directives [[12-directives/server-names-hash-max-size-http-core|server_names_hash_max_size]] et [[12-directives/server-names-hash-bucket-size-http-core|server_names_hash_bucket_size]] au niveau *http*. La valeur par défaut de [[12-directives/server-names-hash-bucket-size-http-core|server_names_hash_bucket_size]] peut être 32, 64 ou une autre valeur selon la taille de ligne de cache du processeur. Si elle vaut 32 et qu'un nom de serveur est « `too.long.server.name.example.org` », nginx ne démarre pas et affiche le message d'erreur :

```
could not build the server_names_hash,
you should increase server_names_hash_bucket_size: 32
```

Il faut alors porter la valeur de la directive à la puissance de deux suivante :

```
http {
    server_names_hash_bucket_size  64;
    ...
```

Si un grand nombre de noms de serveurs sont définis, un autre message d'erreur apparaît :

```
could not build the server_names_hash,
you should increase either server_names_hash_max_size: 512
or server_names_hash_bucket_size: 32
```

Essayez alors d'abord de régler [[12-directives/server-names-hash-max-size-http-core|server_names_hash_max_size]] à un nombre proche du nombre de noms de serveurs. Seulement si cela ne suffit pas, ou si le démarrage de nginx devient trop long, augmentez [[12-directives/server-names-hash-bucket-size-http-core|server_names_hash_bucket_size]].

Si un serveur est le seul sur un port d'écoute, nginx ne teste pas du tout les noms de serveurs (et ne construit pas les tables de hachage de ce port). Exception : si un nom de serveur est une expression régulière avec captures, nginx doit l'exécuter pour obtenir les captures.

## Compatibilité

- Le nom de serveur spécial « `$hostname` » est pris en charge depuis la version 0.9.4.
- Le nom de serveur par défaut est le nom vide « » depuis la version 0.8.48.
- Les captures nommées d'expressions régulières dans les noms de serveurs sont prises en charge depuis la version 0.8.25.
- Les captures d'expressions régulières dans les noms de serveurs sont prises en charge depuis la version 0.7.40.
- Le nom de serveur vide « » est pris en charge depuis la version 0.7.12.
- Un nom générique ou une expression régulière peut servir de premier nom de serveur depuis la version 0.6.25.
- Les noms de serveurs en expressions régulières sont pris en charge depuis la version 0.6.7.
- La forme générique `example.*` est prise en charge depuis la version 0.6.0.
- La forme spéciale `.example.org` est prise en charge depuis la version 0.3.18.
- La forme générique `*.example.org` est prise en charge depuis la version 0.1.13.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

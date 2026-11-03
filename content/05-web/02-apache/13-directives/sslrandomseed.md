---
title: "SSLRandomSeed"
description: "Directive Apache SSLRandomSeed (mod_ssl) — Source de déclenchement du Générateur de Nombres Pseudo-Aléatoires (PRNG). Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Source de déclenchement du Générateur de Nombres Pseudo-Aléatoires (PRNG) |
| **Syntaxe** | `SSLRandomSeed contexte source [nombre]` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive permet de définir une ou plusieurs sources de déclenchement du Générateur de Nombres Pseudo-Aléatoires (PRNG) dans OpenSSL au démarrage du serveur (si *contexte* a pour valeur `startup`) et/ou juste avant l'établissement d'une nouvelle connexion SSL (si *contexte* a pour valeur `connect`). Cette directive ne peut être utilisée qu'au niveau du serveur global car le PRNG est un service global.

Les différentes valeurs de *source* disponibles sont :

- `builtin`

  Cette source de déclenchement intégrée est toujours disponible. Son utilisation consomme un minimum de cycles CPU en cours d'exécution, et son utilisation ne présente de ce fait aucun problème. La source utilisée pour déclencher le PRNG contient la date courante, l'identifiant du processus courant et un extrait de 128 octets aléatoirement choisi dans la pile. Ceci présente un inconvénient car le caractère aléatoire de cette source n'est pas vraiment fort, et au démarrage (lorsque la structure d'échanges n'est pas encore disponible), cette source ne produit que quelques octets d'entropie. Vous devez donc toujours utiliser une source de déclenchement additionnelle, au moins pour le démarrage.
- `file:/chemin/vers/source`

  Cette variante utilise un fichier externe `file:/chemin/vers/source` comme source de déclenchement du PRNG. Lorsque *nombre* est spécifié, seuls les *nombre* premiers octets du fichier forment l'entropie (et *nombre* est fourni comme premier argument à `/chemin/vers/source`). Lorsque *nombre* n'est pas spécifié, l'ensemble du fichier forme l'entropie (et `0` est fourni comme premier argument à `/chemin/vers/source`). Utilisez cette source en particulier au démarrage, par exemple avec un fichier de périphérique `/dev/random` et/ou `/dev/urandom` (qui sont en général présent sur les plate-formes dérivées d'Unix modernes comme FreeBSD et Linux).

  *Soyez cependant prudent* : en général, `/dev/random` ne fournit que l'entropie dont il dispose réellement ; en d'autres termes, lorsque vous demandez 512 octets d'entropie, si le périphérique ne dispose que de 100 octets, deux choses peuvent se produire : sur certaines plates-formes, vous ne recevez que les 100 octets, alors que sur d'autres, la lecture se bloque jusqu'à ce qu'un nombre suffisant d'octets soit disponible (ce qui peut prendre beaucoup de temps). Il est préférable ici d'utiliser le périphérique `/dev/urandom`, car il ne se bloque jamais et fournit vraiment la quantité de données demandées. Comme inconvénient, les données reçues ne sont pas forcément de la meilleure qualité.
- `exec:/chemin/vers/programme`

  Cette variante utilise un exécutable externe `/chemin/vers/programme` comme source de déclenchement du PRNG. Lorsque *nombre* est spécifié, seules les *nombre* premiers octets de son flux `stdout` forment l'entropie. Lorsque *nombre* n'est pas spécifié, l'intégralité des données produites sur `stdout` forment l'entropie. N'utilisez cette variante qu'au démarrage où une source de déclenchement fortement aléatoire est nécessaire, en utilisant un programme externe (comme dans l'exemple ci-dessous avec l'utilitaire `truerand` basé sur la bibliothèque *truerand* de AT&T que vous trouverez dans la distribution de mod\_ssl). Bien entendu, l'utilisation de cette variante dans un contexte "connection" ralentit le serveur de manière trop importante, et en général, vous devez donc éviter d'utiliser des programmes externes dans ce contexte.
- `egd:/chemin/vers/socket-egd` (Unix seulement)

  Cette variante utilise le socket de domaine Unix du Démon Générateur d'Entropie externe ou Entropy Gathering Daemon ou EGD (voir [http://www.lothar.com/tech /crypto/](http://www.lothar.com/tech/crypto/)) pour déclencher le PRNG. N'utilisez cette variante que si votre plate-forme ne possède pas de périphérique random ou urandom.

**Exemple**

```apache
SSLRandomSeed startup builtin
SSLRandomSeed startup "file:/dev/random"
SSLRandomSeed startup "file:/dev/urandom" 1024
SSLRandomSeed startup "exec:/usr/local/bin/truerand" 16
SSLRandomSeed connect builtin
SSLRandomSeed connect "file:/dev/random"
SSLRandomSeed connect "file:/dev/urandom" 1024
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

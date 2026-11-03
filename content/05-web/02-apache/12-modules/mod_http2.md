---
title: "mod_http2"
description: "Module Apache mod_http2 — Support de la couche transport HTTP/2. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_http2]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Support de la couche transport HTTP/2 |
| **Statut** | Extension |
| **Identificateur** | `http2_module` |
| **Fichier source** | `mod_http2.c` |
| **Compatibilité** | Disponible à partir de la version 2.4.17 du serveur HTTP Apache |

## Sommaire

Ce module ajoute la prise en charge de HTTP/2 ([RFC 7540](https://www.rfc-editor.org/rfc/rfc7540)) au serveur HTTP Apache.

Il s'appuie sur la bibliothèque [libnghttp2](http://nghttp2.org/) pour implémenter le moteur de base http/2.

Pour mettre en oeuvre les fonctionnalités décrites dans ce document, vous devez activer HTTP/2 en utilisant la directive [[13-directives/protocols|Protocols]]. HTTP/2 [n'imposant pas](https://http2.github.io/faq/#does-http2-require-encryption) de chiffrement, deux protocoles sont disponibles : `h2` (HTTP/2 avec TLS) at `h2c` (HTTP/2 avec TCP).

Voici deux types de configuration courant :

> [!NOTE]
> **HTTP/2 dans un contexte de serveur virtuel (TLS seulement)**
>
> ```apache
> Protocols h2 http/1.1
> ```
>
> Permet une négociation HTTP/2 (h2) via TLS ALPN au sein d'un [[13-directives/virtualhost|<VirtualHost>]] sécurisé. La vérification du préambule HTTP/2 (mode direct, voir [[13-directives/h2direct|H2Direct]]) est désactivée par défaut pour `h2`.

> [!NOTE]
> **HTTP/2 dans un contexte de serveur (TLS et texte pur)**
>
> ```apache
> Protocols h2 h2c http/1.1
> ```
>
> Permet une négociation HTTP/2 (h2) via TLS ALPN au sein d'un [[13-directives/virtualhost|<VirtualHost>]] sécurisé. Permet aussi une négociation HTTP/2 en texte pur (h2c) en effectuant une mise à jour depuis une connexion initiale HTTP/1.1 ou via une vérification du préambule HTTP/2 (mode direct, voir [[13-directives/h2direct|H2Direct]]).

Si vous avez besoin d'informations supplémentaires à propos du protocole, veuillez vous reporter à la [HTTP/2 FAQ](https://http2.github.io/faq).

## Comment ça marche ?

### Quantification des ressources supplémentaires nécessaires à HTTP/2

Activer HTTP/2 sur votre serveur Apache a un impact sur la consommation de ressources, et si votre site est très actif, il est conseillé d'en prendre sérieusement en compte les implications.

HTTP/2 attribue à chaque requête qu'il reçoit son propre *thread de travail* pour son traitement, la collecte des résultats et l'envoie de ces derniers au client. Pour y parvenir, il lui faut lancer des threads supplémentaires, et ceci constituera le premier effet notable de l'activation de HTTP/2.

Dans l'implémentation actuelle, ces threads de travail font partie d'un jeu de threads distinct de celui des threads de travail du MPM avec lequel vous êtes familié. Il s'agit simplement du mode de fonctionnement actuel, et il n'en sera pas obligatoirement toujours ainsi (il est cependant probable que la situation restera inchangée avec la version 2.4.x). De par ce mode de fonctionnement, les threads de travail HTTP/2, ou plus simplement H2 ne seront pas affichés par [[12-modules/mod_status|mod_status]]. De même, ils ne seront pas pris en compte par les directives du style [[13-directives/threadsperchild|ThreadsPerChild]]. Par contre, ils utilisent par défaut la valeur de [[13-directives/threadsperchild|ThreadsPerChild]] si vous n'avez pas spécifié d'autres valeurs via [[13-directives/h2minworkers|H2MinWorkers]] et [[13-directives/h2maxworkers|H2MaxWorkers]].

Autre changement à surveiller : la consommation de mémoire. En effet, comme HTTP/2 conserve plus d'informations sur le serveur pour gérer toutes les requêtes en cours, leurs priorités et interdépendances, il aura toujours besoin de plus de mémoire que pour un traitement en HTTP/1.1. Trois directives permettent de limiter l'empreinte mémoire d'une connexion HTTP/2 : [[13-directives/h2maxsessionstreams|H2MaxSessionStreams]], [[13-directives/h2windowsize|H2WindowSize]] et [[13-directives/h2streammaxmemsize|H2StreamMaxMemSize]].

La directive [[13-directives/h2maxsessionstreams|H2MaxSessionStreams]] permet de limiter le nombre de requêtes simultanées qu'un client peut envoyer sur une connexion HTTP/2. La valeur que vous allez définir dépend de votre site. La valeur par défaut qui est de 100 est largement suffisante, et à moins que vous ne soyez un peu juste en mémoire, je vous conseille de ne pas la modifier. La plupart des requêtes qu'envoie un client sont des requêtes de type GET sans corps qui n'utilisent que très peu de mémoire en attendant le démarrage du traitement.

La directive [[13-directives/h2windowsize|H2WindowSize]] permet de définir la taille maximale que peut avoir le corps d'une requête que le client envoie avant d'attendre que le serveur en demande d'avantage. En d'autres termes, il s'agit de la quantité de données que le serveur peut stocker dans son tampon, valable pour une requête.

En outre, la directive [[13-directives/h2streammaxmemsize|H2StreamMaxMemSize]] permet de définir la quantité de données de la réponse qui doit être mise en tampon. Chaque requête étant prise en charge par un thread H2Worker et produisant des données que le serveur tente de transmettre au client via une connexion HTTP/2, si le client n'est pas en mesure de lire ces données assez rapidement, la connexion les mettra en tampon et interrompra l'exécution du thread H2Worker correspondant.

### Serveurs virtuels et requêtes mal redirigées

De nombreux site utilisent le même certificat TLS pour plusieurs serveurs virtuels. Ce certificat référence un nom de serveur générique comme '\*.example.org' ou plusieurs noms de serveur différents. Les navigateurs qui utilisent HTTP/2 détectent ce comportement et réutilisent une connexion déjà ouverte pour ces serveurs.

Ceci améliore considérablement les performances, mais il y a un prix à payer : il faut accorder un soin tout particulier à la configuration de tels serveurs virtuels. Le problème réside dans le fait que plusieurs requêtes pour plusieurs serveurs virtuels vont se partager la même connexion TLS, et ceci empêche toute renégociation car le standard HTTP/2 l'interdit.

Ainsi, lorsque plusieurs de vos serveurs virtuels utilisent le même certificat et si vous souhaitez utiliser HTTP/2 pour y accéder, vous devez vous assurer que tous vos serveurs virtuels possèdent exactement la même configuration SSL. En particulier, ils doivent utiliser les mêmes protocole, algorithme de chiffrement et configuration pour la vérification du client.

Dans le cas contraire, Apache httpd le détectera et renverra au client un code de réponse spécial, 421 Misdirected Request.

### Variables d'environnement

Ce module peut être configuré pour fournir des informations en rapport avec HTTP/2 sous la forme de variables d'environnement supplémentaires dans l'espace de nommage SSI et CGI, ainsi que dans les configurations personnalisées de le journalisation (voir `%{VAR_NAME}e`).

| Nom variable : | Type : | Description : |
| --- | --- | --- |
| `HTTPe` | drapeau | HTTP/2 est utilisé. |
| `H2PUSH` | drapeau | La fonctionnalité HTTP/2 Server Push est activée pour cette requête et supportée par le client. |
| `H2_PUSH` | drapeau | autre nom pour `H2PUSH` |
| `H2_PUSHED` | chaîne | vide ou `PUSHED` pour une requête pushée par le serveur. |
| `H2_PUSHED_ON` | nombre | numéro du flux HTTP/2 qui a déclenché le push de cette requête. |
| `H2_STREAM_ID` | nombre | numéro du flux HTTP/2 de cette requête. |
| `H2_STREAM_TAG` | chaîne | identifiant de flux unique du processus HTTP/2 composé de l'identifiant de la connexion et de l'identifiant du flux séparés par `-`. |

## Directives

- [[13-directives/h2direct|H2Direct]]
- [[13-directives/h2push|H2Push]]
- [[13-directives/h2pushdiarysize|H2PushDiarySize]]
- [[13-directives/h2pushpriority|H2PushPriority]]
- [[13-directives/h2upgrade|H2Upgrade]]
- [[13-directives/h2maxsessionstreams|H2MaxSessionStreams]]
- [[13-directives/h2streammaxmemsize|H2StreamMaxMemSize]]
- [[13-directives/h2windowsize|H2WindowSize]]
- [[13-directives/h2minworkers|H2MinWorkers]]
- [[13-directives/h2maxworkers|H2MaxWorkers]]
- [[13-directives/h2maxworkeridleseconds|H2MaxWorkerIdleSeconds]]
- [[13-directives/h2serializeheaders|H2SerializeHeaders]]
- [[13-directives/h2moderntlsonly|H2ModernTLSOnly]]
- [[13-directives/h2tlswarmupsize|H2TLSWarmUpSize]]
- [[13-directives/h2tlscooldownsecs|H2TLSCoolDownSecs]]
- [[13-directives/h2copyfiles|H2CopyFiles]]
- [[13-directives/h2pushresource|H2PushResource]]
- [[13-directives/h2earlyhints|H2EarlyHints]]
- [[13-directives/h2padding|H2Padding]]
- [[13-directives/h2outputbuffering|H2OutputBuffering]]
- [[13-directives/h2streamtimeout|H2StreamTimeout]]
- [[13-directives/h2maxdataframelen|H2MaxDataFrameLen]]
- [[13-directives/h2earlyhint|H2EarlyHint]]
- [[13-directives/h2websockets|H2WebSockets]]
- [[13-directives/h2proxyrequests|H2ProxyRequests]]
- [[13-directives/h2maxheaderblocklen|H2MaxHeaderBlockLen]]
- [[13-directives/h2maxstreamerrors|H2MaxStreamErrors]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

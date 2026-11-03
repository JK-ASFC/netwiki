---
title: "mod_proxy_http"
description: "Module Apache mod_proxy_http — Module fournissant le support HTTP à mod_proxy. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_http]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module fournissant le support HTTP à mod\_proxy |
| **Statut** | Extension |
| **Identificateur** | `proxy_http_module` |
| **Fichier source** | `mod_proxy_http.c` |

## Sommaire

Pour pouvoir fonctionner, ce module *requiert* le chargement de [[12-modules/mod_proxy|mod_proxy]]. Il fournit le support du mandatement des requêtes HTTP et HTTPS. [[12-modules/mod_proxy_http|mod_proxy_http]] supporte HTTP/0.9, HTTP/1.0 et HTTP/1.1. Il ne fournit *aucune* fonctionnalité de mise en cache. Si vous souhaitez mettre en oeuvre un mandataire qui assure aussi les fonctions de mise en cache, vous devez utiliser les services du module [[12-modules/mod_cache|mod_cache]].

Ainsi, pour pouvoir traiter les requêtes HTTP mandatées, [[12-modules/mod_proxy|mod_proxy]], et [[12-modules/mod_proxy_http|mod_proxy_http]] doivent être chargés dans le serveur.

> [!WARNING]
> **Avertissement**
>
> N'activez pas la fonctionnalité de mandataire avant d'avoir [[12-modules/mod_proxy|sécurisé votre serveur]]. Les serveurs mandataires ouverts sont dangereux non seulement pour votre réseau, mais aussi pour l'Internet au sens large.

## Variables d'environnement

Outre les directives de configuration qui contrôlent le comportement de [[12-modules/mod_proxy|mod_proxy]], plusieurs *variables d'environnement* permettent de contrôler le fournisseur du protocole HTTP. Parmi les variables suivantes, celle qui ne nécessitent pas de valeur particulière sont définies quelle que soit la valeur qu'on leur affecte.

**proxy-sendextracrlf**

Provoque l'envoi par le mandataire d'une nouvelle ligne CR-LF supplémentaire à la fin de la requête. Ceci constitue un moyen de contournement d'une bogue de certains navigateurs.

**force-proxy-request-1.0**

Force le mandataire à envoyer des requêtes vers le serveur cible selon le protocole HTTP/1.0 et désactive les fonctionnalités propres à HTTP/1.1.

**proxy-nokeepalive**

Force le mandataire à fermer la connexion avec le serveur cible après chaque requête.

**proxy-chain-auth**

Si le mandataire requiert une authentification, il va lire et exploiter les données d'authentification pour mandataire envoyées par le client. Si *proxy-chain-auth* est définie, il va *aussi* faire suivre ces données vers le mandataire suivant dans la chaîne. Ceci peut s'avérer nécessaire si une chaîne de mandataires partagent les informations d'authentification. **Avertissement concernant la sécurité :** Ne définissez cette variable que si vous êtes sûr d'en avoir besoin, car elle peut provoquer la divulgation d'informations sensibles !

**proxy-sendcl**

Avec HTTP/1.0, toutes les requêtes qui possèdent un corps (par exemple les requêtes POST) doivent comporter un en-tête *Content-Length*. Cette variable d'environnement force le mandataire Apache à envoyer cet en-tête au serveur cible, sans tenir compte de ce que lui a envoyé le client. Ceci permet d'assurer la compatibilité lorsqu'on mandate un serveur cible mettant en oeuvre un protocole de type HTTP/1.0 ou inconnu. Elle peut cependant nécessiter la mise en tampon de l'intégralité de la requête par le mandataire, ce qui s'avère très inefficace pour les requêtes de grande taille.

**proxy-sendchunks ou proxy-sendchunked**

Cette variable constitue l'opposé de *proxy-sendcl*. Elle permet la transmission des corps de requêtes vers le serveur cible en utilisant un codage de transfert fractionné. Ceci permet une transmission des requêtes plus efficace, mais nécessite que le serveur cible supporte le protocole HTTP/1.1.

**proxy-interim-response**

Cette variable peut prendre les valeurs `RFC` (valeur par défaut) ou `Suppress`. Les versions précédentes de httpd supprimaient les réponses intermédiaires HTTP (1xx) envoyées par le serveur cible. En pratique, si un serveur cible envoie une réponse intermédiaire, il se peut qu'il étende lui-même le protocole d'une manière dont nous n'avons pas connaissance, ou tout simplement non conforme. Le comportement du mandataire est donc maintenant configurable : définissez `proxy-interim-response RFC` pour être totalement compatible avec le protocole, ou `proxy-interim-response Suppress` pour supprimer les réponses intermédiaires.

**proxy-initial-not-pooled**

Si cette variable est définie, aucune connexion faisant partie d'un jeu ne sera réutilisée si la requête du client est la requête initiale pour une connexion. Ceci permet d'éviter le message d'erreur "proxy: error reading status line from remote server" causé par la situation de compétition au cours de laquelle le serveur cible ferme la connexion du jeu après la vérification de la connexion par le mandataire, et avant que les données envoyées par le mandataire n'atteignent le serveur cible. Il faut cependant garder à l'esprit que la définition de cette variable dégrade les performances, particulièrement avec les clients HTTP/1.0.

## Informations sur les requêtes

[[12-modules/mod_proxy_http|mod_proxy_http]] enregistre les informations suivantes pour journalisation via le format `%{NOMVAR}n` dans les directives [[13-directives/logformat|LogFormat]] ou [[13-directives/errorlogformat|ErrorLogFormat]] :

**proxy-source-port**

Le port local utilisé pour la connexion vers le serveur d'arrière-plan.

**proxy-status**

Le code d'état HTTP reçu du serveur d'arrière-plan.

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

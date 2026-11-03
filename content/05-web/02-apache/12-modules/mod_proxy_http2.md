---
title: "mod_proxy_http2"
description: "Module Apache mod_proxy_http2 — Support de HTTP/2 pour mod_proxy. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_http2]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Support de HTTP/2 pour mod\_proxy |
| **Statut** | Extension |
| **Identificateur** | `proxy_http2_module` |
| **Fichier source** | `mod_proxy_http2.c` |
| **Compatibilité** | Disponible à partir de la version 2.4.19 du serveur HTTP Apache |

## Sommaire

[[12-modules/mod_proxy_http2|mod_proxy_http2]] ne supporte que HTTP/2 et ne permet pas de rétrogradation vers HTTP/1.1. Cela signifie que le serveur d'arrière-plan doit supporter HTTP/2 car HTTP/1.1 ne pourra alors pas être utilisé.

Ce module *nécessite* la présence de [[12-modules/mod_proxy|mod_proxy]] ; pour pouvoir traiter les requêtes mandatées HTTP/2, [[12-modules/mod_proxy|mod_proxy]] et [[12-modules/mod_proxy_http2|mod_proxy_http2]] doivent donc être chargés par le serveur.

[[12-modules/mod_proxy_http2|mod_proxy_http2]] travaille avec des requêtes entrantes en HTTP/1.1 ou HTTP/2. Dans les deux cas, les requêtes vers le même serveur d'arrière-plan sont envoyées via une seule connexion TCP, dans la mesure du possible (autrement dit lorsque la connexion peut être réutilisée).

Avertissement : il ne sera effectué aucune tentative de fusion de plusieurs requêtes entrantes HTTP/1 (devant être mandatées vers le même serveur d'arrière-plan) vers des flux HTTP/2 appartenant à la même requête HTTP/2. Chaque requête HTTP/1 entrante sera mandatée vers le serveur d'arrière-plan en utilisant une requête HTTP/2 séparée (tout en réutilisant si possible la même connexion TCP).

Ce module s'appuie sur [libnghttp2](http://nghttp2.org/) pour fournir le moteur central http/2.

> [!WARNING]
> **Avertissement**
>
> Ce module en est au stade expérimental. Ses comportement, directives et valeurs par défauts sont donc susceptibles de modifications d'une version à l'autre plus fréquentes que pour les autres modules. A ce titre, il est fortement conseillé aux utilisateurs de consulter le fichier "CHANGES" pour prendre connaissance de ces modifications.

> [!WARNING]
> **Avertissement**
>
> N'activez pas le mandatement avant d'avoir [[12-modules/mod_proxy|sécurisé votre serveur]]. Les serveurs mandataires ouverts sont dangereux non seulement pour votre propre réseau, mais aussi pour l'Internet au sens large.

## Exemples de base

Les exemples ci-dessous montrent comment configurer HTTP/2 pour des connexions d'arrière-plan vers un mandataire inverse.

**HTTP/2 (TLS)**

```apache
ProxyPass "/app" "h2://app.example.com"
ProxyPassReverse "/app" "https://app.example.com"
```

**HTTP/2 (non sécurisé)**

```apache
ProxyPass "/app" "h2c://app.example.com"
ProxyPassReverse "/app" "http://app.example.com"
```

> [!NOTE]
> Pour mandater en inverse les protocoles `h2` ou `h2c`, on utilise la directive `ProxyPassReverse` avec les schèmes habituels `https` et respectivement `http` qui sont connus et utilisés par l'agent utilisateur.

## Informations sur les requêtes

[[12-modules/mod_proxy_http|mod_proxy_http]] fournit les informations sur les requêtes suivantes pour enregistrement dans les journaux en utilisant le format `%{VARNAME}n` avec les directives [[13-directives/logformat|LogFormat]] ou [[13-directives/errorlogformat|ErrorLogFormat]] :

**proxy-source-port**

Le numéro de port local utilisé pour la connexion vers le serveur d'arrière-plan.

**proxy-status**

Le statut HTTP/2 en provenance du serveur d'arrière-plan.

## Voir aussi

- [[12-modules/mod_http2|mod_http2]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

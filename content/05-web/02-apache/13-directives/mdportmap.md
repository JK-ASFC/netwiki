---
title: "MDPortMap"
description: "Directive Apache MDPortMap (mod_md) — Mappage des ports externes avec les ports internes pour vérifier à qui appartient le domaine. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Mappage des ports externes avec les ports internes pour vérifier à qui appartient le domaine. |
| **Syntaxe** | `MDPortMap map1 [ map2 ]` |
| **Valeur par défaut** | `MDPortMap http:80 https:443` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Le protocole ACME propose deux méthodes pour vérifier à qui appartient le domaine via HTTP : la première utilise les URLs en "http:" (port 80) et la deuxième les URLs en "https:" (port 443). Si votre serveur n'est accessible sur aucun de ces ports, ACME ne pourra fonctionner que si vous configurez votre serveur DNS de manière adéquate (voir la directive [[13-directives/mdchallengedns01|MDChallengeDns01]]).

Sur la plupart des serveurs publics, "http:" arrive sur le port 80 et "https:" sur le port 443. Ce module vérifie les ports sur lesquels votre serveur Apache est en écoute et suppose qu'ils sont disponibles. Autrement dit, si votre serveur n'est pas en écoute sur le port 80, le module suppose que les requêtes en "http:" en provenance d'internet ne seront pas traitées.

Ce raisonnement est légitime, mais il peut s'avérer faux. Par exemple, même si votre serveur est effectivement en écoute sur le port 80, votre pare-feu peut bloquer ce dernier. "http:" ne sera alors disponible que sur votre intranet. Dans ce cas, le module va supposer de manière erronée que Let's Encrypt peut effectuer des vérifications en "http:" avec votre serveur. Ces dernières échouerons car elles auront été rejetées par votre pare-feu.

**Exemple**

```apache
MDPortMap http:- https:8433
```

L'exemple précédent montre comment spécifier que les requêtes en "http:" en provenance d'internet n'arriveront jamais. En outre, il indique que les requêtes en "https:" arriveront sur le port 8433.

Cette définition peut s'avérer nécessaire si vous faites de la redirection de port ; votre serveur peut ainsi être accessible depuis l' Internet sur le port 443, alors que le port local utilisé par httpd sera différent. Par exemple, votre serveur peut n'être en écoute que sur les ports 8443 et 8000, mais accessible depuis internet sur les ports 443 et 80.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

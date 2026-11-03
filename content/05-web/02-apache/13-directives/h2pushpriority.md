---
title: "H2PushPriority"
description: "Directive Apache H2PushPriority (mod_http2) — Priorité des pushes H2. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Priorité des pushes H2 |
| **Syntaxe** | `H2PushPriority mime-type [after\|before\|interleaved] [weight]` |
| **Valeur par défaut** | `H2PushPriority * After 16` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.18 du serveur HTTP Apache. Nécessite la bibliothèque nghttp2 version 1.5.0 ou supérieure. |

## Utilisation

Cette directive permet de définir une gestion de priorité des pushes en fonction du type de contenu de la réponse. Elle est en général définie au niveau du serveur principal, mais peut aussi l'être au niveau d'un serveur virtuel.

Les pushes HTTP/2 sont toujours liés à une requête client. Chaque paire requête/réponse de cette sorte, ou *flux*, possède une dépendance et un poids qui définissent la *priorité* du flux.

Lorsqu'un flux *dépend* d'un autre, disons X dépend de Y, alors Y reçoit toute la bande passante avant que X n'en reçoive ne serait-ce qu'une partie. Notez que cela ne signifie en rien que Y bloque X ; en effet, si Y n'a aucune donnée à envoyer, toute la bande passante qui lui est allouée peut être utilisée par X.

Lorsque plusieurs flux dépendent d'un même autre flux, disons X1 et X2 dépendent tous deux de Y, le *poids* détermine la bande passante allouée. Ainsi, si X1 et X2 possèdent le même poids, ils recevront tous deux la moitié de la bande passante disponible. Si le poids de X1 est égal au double de celui de X2, X1 recevra une bande passante double de celle de X2.

En fin de compte, tout flux dépend du flux *racine* qui reçoit toute la bande passante disponible mais n'envoie jamais de données. Cette bande passante est ainsi répartie entre les flux enfants selon leur poids. Ces derniers l'utilisent alors pour envoyer leurs données ou pour la répartir entre leurs propres flux enfants, et ainsi de suite. Si aucun des flux enfants n'a de données à envoyer, la bande passante est attribuée à d'autres flux selon les mêmes règles.

Ce système de priorités a été conçu de façon a toujours pouvoir utiliser la bande passante disponible tout en définissant des priorités et en attribuant des poids aux différents flux. Ainsi, tous les flux sont en général initialisés par le client qui lui-même définit les priorités.

Seul le fait de savoir qu'un flux implique un PUSH permet au serveur de décider quelle est la priorité *initiale* d'un tel flux. Dans les exemples ci-dessous, X est le flux client. Il dépend de Y et le serveur décide de "PUSHer" les flux P1 et P2 sur X.

La règle de priorité par défaut est :

**Règle de priorité par défaut**

```apache
H2PushPriority * After 16
```

Elle peut se traduire par "Envoyer un flux PUSH avec tout type de contenu et dépendant du flux client avec le poids 16". P1 et P2 seront alors envoyés après X, et comme leurs poids sont identiques, il se verront allouer la même quantité de bande passante.

**Règle de priorité entrelacée**

```apache
H2PushPriority text/css Interleaved 256
```

Ce qui peut se traduire par "Envoyer toute ressource CSS dans la même dépendance et avec le même poids que le flux client". Si le type de contenu de P1 est "text/css", il dépendra de Y (comme X) et son poids effectif sera calculé selon la formule : `P1ew = Xw * (P1w / 256)`. Si P1w est de 256, Le poids effectif de P1 sera le même que celui de X. Si X et P1 ont des données à envoyer, il se verront allouer la même quantité de bande passante.

Avec un Pw de 512, un flux entrelacé et PUSHé aura un poids double de celui de X. Avec un poids de 128, son poids ne sera que la moitié de celui de X. Notez que les poids effectifs sont toujours plafonnés à 256.

**Règle de priorité Before**

```apache
H2PushPriority application/json Before
```

Dans cet exemple, tout flux PUSHé dont le contenu est de type 'application/json' sera envoyé *avant* X, ce qui rend P1 dépendant de Y et X dépendant de P1. Ainsi, X sera mis en attente aussi longtemps que P1 aura des données à envoyer. Le poids effectif est hérité du flux client, et l'attribution d'un poids spécifique n'est pas autorisée.

Vous devez garder à l'esprit que les spécifications en matière de priorités sont limitées par les ressources disponibles du serveur. Si un serveur ne dispose d'aucun processus/thread de travail pour les flux PUSHés, les données du flux considéré ne seront envoyées que lorsque les autres flux auront terminé l'envoi des leurs.

Enfin et surtout, il convient de tenir compte de certaines particularités de la syntaxe de cette directive :

1. '\*' est la seule expression permettant de remplacer tout type de contenu. 'image/\*' ne fonctionnera pas.
2. La dépendance par défaut est 'After'.
3. Il existe aussi des poids par défaut : pour 'After' le poids est de 16, alors que pour 'interleaved' il est de 256.

**Exemples de règles**

```apache
H2PushPriority application/json 32         # une règle de priorité 'After'
H2PushPriority image/jpeg before           # poid hérité
H2PushPriority text/css   interleaved      # poids de 256 par défaut
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

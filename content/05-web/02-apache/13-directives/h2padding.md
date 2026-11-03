---
title: "H2Padding"
description: "Directive Apache H2Padding (mod_http2) — Spécifie un intervalle de nombres d'octets de bourrage à ajouter aux trames utiles. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie un intervalle de nombres d'octets de bourrage à ajouter aux trames utiles |
| **Syntaxe** | `H2Padding numbits` |
| **Valeur par défaut** | `H2Padding 0` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.39 du serveur HTTP Apache. |

## Utilisation

La valeur par défaut 0 indique qu'aucun octet de bourrage ne sera ajouté aux trames utiles comme HEADERS, DATA et PUSH\_PROMISE. Ceci correspond au comportement des versions précédentes. Dans ce cas et sous certaines conditions, un observateur du trafic réseau pourra alors déterminer la longueur de ces trames dans le flux TLS.

Si on attribue à numbits la valeur 1-8, un nombre aléatoire d'octets entre 0 et 2^numbits sont ajoutés à chaque trame. Une valeur aléatoire d'octets de bourrage est attribué indépendamment à chaque trame que le module renvoie au client.

Pour améliorer la dissimulation de la longueur des trames, on peut augmenter le nombre moyen d'octets de bourrage, mais cela augmente d'autant le trafic réseau. Le nombre optimal d'octets de bourrage dépend donc du type de trafic web que le serveur engendre.

La valeur par défaut de 0 (aucun octet de bourrage) a été choisie dans un but de compatibilité ascendante. Il peut en effet exister des installations où les octets de bourrage ne sont pas souhaités ou sont néfastes. La cause principale peut provenir d'un client dont l'implémentation comporte des erreurs.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

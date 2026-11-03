---
title: "H2TLSWarmUpSize"
description: "Directive Apache H2TLSWarmUpSize (mod_http2) — Taille des paquets durant la phase initiale de la connexion TLS. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille des paquets durant la phase initiale de la connexion TLS |
| **Syntaxe** | `H2TLSWarmUpSize amount` |
| **Valeur par défaut** | `H2TLSWarmUpSize 1048576` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.18 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir le nombre d'octets à envoyer dans les petits enregistrements TLS (~1300 octets) avant d'atteindre leur taille maximale de 16 ko pour les connexions https: HTTP/2. Elle peut être définie au niveau du serveur principal ou pour des `<Serveurs virtuels>` spécifiques.

Les mesures effectuées par les [laboratoires de performances de Google](https://www.igvita.com) montrent que les meilleurs performances sont atteintes pour les connexions TLS si la taille initiale des enregistrements reste en deça du niveau du MTU afin de permettre à la totatlité d'un enregistrement d'entrer dans un paquet IP.

Comme TCP ajuste son contrôle de flux et sa taille de fenêtre, des enregistrements TLS trop longs peuvent rester en file d'attente ou même être perdus et devoir alors être réémis. Ceci est bien entendu vrai pour tous les paquets ; cependant, TLS a besoin de la totalité de l'enregistrement pour pouvoir le déchiffrer. Tout octet manquant rendra impossible l'utilisation de ceux qui ont été reçus.

Lorqu'un nombre suffisant d'octets a été transmis avec succès, la connexion TCP est stable, et la taille maximale (16 ko) des enregistrements TLS peut être utilisée pour des performances optimales.

Dans les architectures où les serveurs sont atteints par des machines locales ou pour les connexions de confiance seulement, la valeur de cette directive peut être définie à 0, ce qui a pour effet de désactiver la "phase de chauffage".

Dans l'exemple suivant, la phase de chauffage est effectivement désactivée en définissant la directive à 0.

**Exemple**

```apache
H2TLSWarmUpSize 0
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

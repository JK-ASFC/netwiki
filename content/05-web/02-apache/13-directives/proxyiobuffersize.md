---
title: "ProxyIOBufferSize"
description: "Directive Apache ProxyIOBufferSize (mod_proxy) — Détermine la taille du tampon interne de transfert de données. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine la taille du tampon interne de transfert de données |
| **Syntaxe** | `ProxyIOBufferSize octets` |
| **Valeur par défaut** | `ProxyIOBufferSize 8192` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

La directive `ProxyIOBufferSize` permet d'ajuster la taille du tampon interne utilisé comme bloc-note pour les transferts de données entre entrée et sortie. La taille minimale est de `512` octets, ou définie à `0` pour indiquer que la taille de tampon par défaut du système doit être utilisée.

Dans la plupart des cas, il n'y a aucune raison de modifier cette valeur.

Si elle est utilisée avec AJP, cette directive permet de définir la taille maximale du paquet AJP en octets. Si la valeur spécifiée est supérieure à 65536, elle est corrigée et prend la valeur 65536. Si vous ne conservez pas la valeur par défaut, vous devez aussi modifier l'attribut `packetSize` de votre connecteur AJP du côté de Tomcat ! L'attribut `packetSize` n'est disponible que dans Tomcat `5.5.20+` et `6.0.2+`.

Il n'est normalement pas nécessaire de modifier la taille maximale du paquet. Des problèmes ont cependant été rapportés avec la valeur par défaut lors de l'envoi de certificats ou de chaînes de certificats.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

---
title: "mod_reqtimeout"
description: "Module Apache mod_reqtimeout — Définit le délai maximum et le taux minimum de transfert des données pour la réception des requêtes. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_reqtimeout]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le délai maximum et le taux minimum de transfert des données pour la réception des requêtes |
| **Statut** | Extension |
| **Identificateur** | `reqtimeout_module` |
| **Fichier source** | `mod_reqtimeout.c` |
| **Compatibilité** | Disponible depuis la version 2.2.15 du serveur HTTP Apache |

## Sommaire

Ce module permet de définir aisément le délai maximum et le taux de transfert des données minimum pour la réception des requêtes. Si ce délai est dépassé ou ce taux trop faible, la connexion concernée sera fermée par le serveur.

Cet évènement sera alors enregistré dans le journal au niveau de [[13-directives/loglevel|LogLevel]] `info`.

Au besoin, la directive [[13-directives/loglevel|LogLevel]] peut être modifiée pour un enregistrement dans le journal plus explicite :

```apache
LogLevel reqtimeout:info
```

## Exemples

1. Accorde 5 secondes pour terminer la négociation TLS, 10 secondes pour la réception des en-têtes de la requête et 30 secondes pour la réception du corps :

   ```apache
   RequestReadTimeout handshake=5 header=10 body=30
   ```
2. Accorde au moins 10 secondes pour la réception du corps de la requête. Si le client envoie des données, augmente ce délai d'une seconde pour chaque paquet de 1000 octets reçus, sans limite supérieure (sauf si une limite a été spécifiée via la directive [[13-directives/limitrequestbody|LimitRequestBody]]) :

   ```apache
   RequestReadTimeout body=10,MinRate=1000
   ```
3. Accorde au moins 10 secondes pour la réception des en-têtes de la requête. Si le client envoie des données, augmente ce délai d'une seconde pour chaque paquet de 500 octets reçus, mais n'alloue que 30 secondes pour les en-têtes de la requête :

   ```apache
   RequestReadTimeout header=10-30,MinRate=500
   ```
4. En général, un serveur doit avoir ses délais d'en-tête et de corps configurés. Si les serveurs virtuels http et https utilisent une configuration commune, les délais ne doivent pas être définis trop bas :

   ```apache
   RequestReadTimeout header=20-40,MinRate=500 body=20,MinRate=500
   ```

## Directives

- [[13-directives/requestreadtimeout|RequestReadTimeout]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

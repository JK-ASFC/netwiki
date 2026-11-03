---
title: "RequestReadTimeout"
description: "Directive Apache RequestReadTimeout (mod_reqtimeout) — Définit des délais maximums pour la négociation TLS, la réception des en-têtes et/ou corps des requêtes en provenance du client. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_reqtimeout]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit des délais maximums pour la négociation TLS, la réception des en-têtes et/ou corps des requêtes en provenance du client. |
| **Syntaxe** | `RequestReadTimeout [handshake=timeout[-maxtimeout][,MinRate=rate] [header=timeout[-maxtimeout][,MinRate=MinRate] [body=timeout[-maxtimeout][,MinRate=MinRate]` |
| **Valeur par défaut** | `RequestReadTimeout handshake=0 header=20-40,MinRate=500 body=20,MinRate=500` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_reqtimeout\|mod_reqtimeout]] |
| **Compatibilité** | Disponible depuis la version 2.2.15 du serveur HTTP Apache ; désactivée par défaut depuis la version 2.3.14. La phase de `négociation` est prise en compte à partir de la version 2.4.39. |

## Utilisation

Cette directive permet de définir différents timeouts pour la négociation TLS, la réception des en-têtes et/ou corps des requêtes en provenance du client. Si le client ne parvient pas à respecter ces timeouts, un code d'erreur `408 REQUEST TIME OUT` est envoyé.

Pour les serveurs virtuels SSL, la valeur de timeout pour la `négociation` correspond au temps nécessaire pour la négociation SSL initiale. Si le navigateur du client est configuré pour demander des listes de révocations de certificats, et si le serveur correspondant n'est pas disponible, le timeout avant lequel le navigateur va abandonner son attente de CRL au cours de la négociation SSL initiale peut être assez important. Par conséquent, les valeurs de timeouts pour la `négociation` doivent prendre en compte un temps supplémentaire pour les serveurs virtuels SSL (si nécessaire). Le timeout concernant le corps inclut le temps nécessaire à la renégociation SSL (si elle est nécessaire).

Lorsqu'une directive [[13-directives/acceptfilter|AcceptFilter]] est active (ce qui est en général le cas sous Linux et FreeBSD), la socket n'est envoyée au processus du serveur qu'après la réception du premier octet (ou de l'ensemble de la requête si `httpready` est défini). Les timeouts configurés pour la négociation et les en-têtes via la directive `RequestReadTimeout` n'entrent en ligne de compte qu'une fois le socket reçu par le processus du serveur.

Il existe trois méthodes pour spécifier le timeout pour chacune des trois phases (négociation, en-tête ou corps) :

- **Valeur de timeout fixe**:

  ```
  phase=timeout
  ```

  Le temps en secondes alloué pour terminer l'ensemble de la phase (négociation, lecture de tous les en-têtes de la requête ou du corps de cette dernière). La valeur 0 signifie aucune limite.
- **Désactivation du module pour un serveur virtuel**:

  ```
  handshake=0 header=0 body=0
  ```

  Avec cet exemple, le module [[12-modules/mod_reqtimeout|mod_reqtimeout]] est complètement désactivé (notez que `handshake=0` correspond à la valeur par défaut et peut donc être omis).
- **La valeur du timeout qui est augmentée lorsque des données sont reçues** :

  ```
  phase=timeout,MinRate=débit
  ```

  Identique à ce qui précède, mais chaque fois que des données sont reçues, la valeur du timeout est augmentée en fonction du MinRate spécifié (en octets par seconde).
- **La valeur du timeout augmente lorsque des données sont reçues, jusqu'à une limite supérieure**:

  ```
  phase=timeout-maxtimeout,MinRate=débit
  ```

  Identique à ce qui précède, mais le timeout n'augmentera pas au delà de la borne supérieure du timeout spécifiée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

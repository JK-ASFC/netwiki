---
title: "mod_ratelimit"
description: "Module Apache mod_ratelimit — Limitation de la bande passante pour les clients. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_ratelimit]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Limitation de la bande passante pour les clients |
| **Statut** | Extension |
| **Identificateur** | `ratelimit_module` |
| **Fichier source** | `mod_ratelimit.c` |
| **Compatibilité** | `rate-initial-burst` est disponible à partir de la version 2.4.24 du serveur HTTP Apache. La limitation de bande passante pour les contenus mandatés ne fonctionne pas correctement jusqu'à la version 2.4.33. |

## Sommaire

Ce module fournit un filtre `RATE_LIMIT` pour limiter la bande passante des clients. Cette contrainte s'applique à chaque réponse HTTP au moment où elle est envoyée au client ; elle n'affecte pas les autres échanges entre le client et le serveur. La variable d'environnement `rate-limit` permet de spécifier, en kb/s, le débit de la connexion à simuler.

Optionnellement, il est possible, via la variable d'environnement `rate-initial-burst`, de définir une quantité de données en kOctets à transmettre à pleine vitesse avant de limiter la bande passante à la valeur voulue.

> [!WARNING]
> **Consommation de ressources**
>
> La limitation de bande passante est implémentée en insérant des pauses entre les écritures vers le client ; ainsi, chaque réponse faisant l’objet d’une limitation de bande passante mobilise un thread du serveur (ou un processus) pour la durée entière du transfert délibérément prolongé. Cela concerne tous les MPMs, y compris [[12-modules/event|event]]. Un certain nombre, même modeste, de téléchargements lents limités en bande passante peut entraîner le dépassement du nombre de threads ou processus de travail du serveur disponibles et empêcher le traitement des autres requêtes. Il est donc recommandé d’utiliser ce module avec prudence, de limiter son utilisation aux ressources qui en ont vraiment besoin et de définir [[13-directives/maxrequestworkers|MaxRequestWorkers]] en conséquence.

**Exemple de configuration**

```apache
<Location "/downloads">
    SetOutputFilter RATE_LIMIT
    SetEnv rate-limit 400
    SetEnv rate-initial-burst 512
</Location>
```

```
Si la valeur affectée à rate-limit dépasse la valeur maximale à
affecter à un entier, la limitation de bande passante sera désactivée. Si la
valeur affectée à rate-limit-burst dépasse la valeur maximale à
affecter à un entier, la transmission du burst initial sans limitation de bande
passante sera désactivée.
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

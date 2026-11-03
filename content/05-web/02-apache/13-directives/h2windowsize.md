---
title: "H2WindowSize"
description: "Directive Apache H2WindowSize (mod_http2) — Taille maximale des paquets de données pour les transmissions client vers serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille maximale des paquets de données pour les transmissions client vers serveur. |
| **Syntaxe** | `H2WindowSize bytes` |
| **Valeur par défaut** | `H2WindowSize 65535` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |

## Utilisation

Cette directive permet de définir la taille maximale des paquets de données envoyés par le client au serveur, et limite la quantité de données que le serveur doit mettre en tampon. Le client arrêtera d'envoyer des données sur un flux lorsque cette limite sera atteinte jusqu'à ce que le serveur indique qu'il dispose d'un espace suffisant (car il aura traité une partie des données).

Cette limite n'affecte que les corps de requêtes, non les métadonnées comme les en-têtes. Par contre, elle n'affecte pas les corps de réponses car la taille maximale de ces derniers est gérée au niveau des clients.

**Exemple**

```apache
H2WindowSize 128000
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

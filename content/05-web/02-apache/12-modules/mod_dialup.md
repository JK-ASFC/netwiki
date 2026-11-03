---
title: "mod_dialup"
description: "Module Apache mod_dialup — Envoie le contenu statique avec une bande passante limitée définie par les différents standards des anciens modems. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_dialup]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Envoie le contenu statique avec une bande passante limitée définie par les différents standards des anciens modems. |
| **Statut** | Expérimental |
| **Identificateur** | `dialup_module` |
| **Fichier source** | `mod_dialup.c` |

## Sommaire

Il s'agit d'un module qui envoie le contenu statique avec une bande passante limitée définie par les différents standards des anciens modems. Ainsi, il est possible de naviguer sur votre site avec un modem 56k V.92 en positionnant une configuration de ce type :

```apache
<Location "/mysite">
    ModemStandard "V.92"
</Location>
```

Auparavant, pour faire des modules de limitation de bande passante, il fallait monopoliser un thread, pour chaque client, et insérer des temporisations pour diminuer la bande passante. Grâce à cette nouvelle fonctionnalité, un gestionnaire peut recevoir les réponses à ses callbacks après N millisecondes, et il sera invoqué par le module MPM Event dans un thread différent à la fin du délai indiqué. À partir de ce moment, le gestionnaire peut continuer à envoyer des données au client.

## Directives

- [[13-directives/modemstandard|ModemStandard]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

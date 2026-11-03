---
title: "ListenBackLog"
description: "Directive Apache ListenBackLog (mpm_common) — Longueur maximale de la liste d'attente des connexions. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Longueur maximale de la liste d'attente des connexions |
| **Syntaxe** | `ListenBackLog backlog` |
| **Valeur par défaut** | `ListenBackLog 511` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

La longueur maximale de la liste d'attente des connexions. En général, aucune modification n'est nécessaire, ni même souhaitable ; cependant, sur certains systèmes, il peut être nécessaire d'en augmenter la valeur en cas d'attaque TCP SYN flood (envoi en masse de requêtes SYN pour saturer le serveur). Voir le paramètre backlog de l'appel système `listen(2)`.

En fait, l'argument backlog sera souvent limité à une valeur inférieure en fonction du système d'exploitation. Notez aussi que de nombreux systèmes d'exploitation ne tiennent pas vraiment compte de la valeur spécifiée pour l'argument backlog, mais s'en inspirent seulement (et choisissent en général une valeur supérieure).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

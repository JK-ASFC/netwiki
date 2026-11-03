---
title: "GracefulShutdownTimeout"
description: "Directive Apache GracefulShutdownTimeout (mpm_common) — Spécifie le délai maximum après lequel le serveur va s'arrêter dans le cas d'un arrêt \"en douceur\". Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie le délai maximum après lequel le serveur va s'arrêter dans le cas d'un arrêt "en douceur" |
| **Syntaxe** | `GracefulShutdownTimeout seconds` |
| **Valeur par défaut** | `GracefulShutdownTimeout 0` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |
| **Compatibilité** | Disponible dans les versions 2.2 et supérieures |

## Utilisation

La directive `GracefulShutdownTimeout` permet de spécifier le temps, en secondes, pendant lequel le serveur va continuer à fonctionner après avoir reçu un signal "graceful-stop" ("Arrêt en douceur"), afin de terminer le traitement des connexions en cours.

Définir cette valeur à zéro signifie au serveur d'attendre jusqu'à ce que toutes les requêtes en cours aient été traitées.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

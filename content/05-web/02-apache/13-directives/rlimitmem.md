---
title: "RLimitMEM"
description: "Directive Apache RLimitMEM (core) — Limite la mémoire allouée aux processus initiés par les processus enfants d'Apache httpd. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Limite la mémoire allouée aux processus initiés par les processus enfants d'Apache httpd |
| **Syntaxe** | `RLimitMEM octets\|max [octets\|max]` |
| **Valeur par défaut** | `Non défini ; utilise les valeurs par défaut du système d'exploitation` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Prend 1 ou 2 paramètres. Le premier definit la limite de consommation de ressources pour tous les processus, et le second la consommation de ressources maximale. Les deux paramètres peuvent contenir soit un nombre, soit `max` pour indiquer au serveur que la limite de consommation correspond à la valeur maximale autorisée par la configuration du système d'exploitation. Pour augmenter la consommation maximale de ressources, le serveur doit s'exécuter en tant que `root`, ou se trouver dans sa phase de démarrage.

Cette directive s'applique aux processus initiés par les processus enfants d'Apache httpd qui traitent les requêtes, et non aux processus enfants eux-mêmes. Sont concernés les scripts CGI et les commandes exec des SSI, mais en aucun cas les processus initiés par le processus parent d'Apache httpd comme les journalisations redirigées vers un programme.

Les limites de ressources mémoire sont exprimées en octets par processus.

## Voir aussi

- [[13-directives/rlimitcpu|RLimitCPU]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

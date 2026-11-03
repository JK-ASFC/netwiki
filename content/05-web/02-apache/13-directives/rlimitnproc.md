---
title: "RLimitNPROC"
description: "Directive Apache RLimitNPROC (core) — Limite le nombre de processus qui peuvent être initiés par les processus initiés par les processus enfants d'Apache httpd. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Limite le nombre de processus qui peuvent être initiés par les processus initiés par les processus enfants d'Apache httpd |
| **Syntaxe** | `RLimitNPROC nombre\|max [nombre\|max]` |
| **Valeur par défaut** | `Unset; uses operating system defaults` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Prend 1 ou 2 paramètres. Le premier definit la limite de consommation de ressources pour tous les processus, et le second la consommation de ressources maximale. Les deux paramètres peuvent contenir soit un nombre, soit `max` pour indiquer au serveur que la limite de consommation correspond à la valeur maximale autorisée par la configuration du système d'exploitation. Pour augmenter la consommation maximale de ressources, le serveur doit s'exécuter en tant que `root`, ou se trouver dans sa phase de démarrage.

Cette directive s'applique aux processus initiés par les processus enfants d'Apache httpd qui traitent les requêtes, et non aux processus enfants eux-mêmes. Sont concernés les scripts CGI et les commandes exec des SSI, mais en aucun cas les processus initiés par le processus parent d'Apache httpd comme les journalisations redirigées vers un programme.

Les limites des processus contrôlent le nombre de processus par utilisateur.

> [!NOTE]
> **Note**
>
> Si les processus CGI s'exécutent sous le même utilisateur que celui du serveur web, cette directive va limiter le nombre de processus que le serveur pourra lui-même créer. La présence de messages **`cannot fork`** dans le journal des erreurs indiquera que la limite est atteinte.

## Voir aussi

- [[13-directives/rlimitmem|RLimitMEM]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

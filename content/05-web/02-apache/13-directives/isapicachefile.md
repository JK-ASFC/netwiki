---
title: "ISAPICacheFile"
description: "Directive Apache ISAPICacheFile (mod_isapi) — Fichiers .dll ISAPI devant être chargés au démarrage. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_isapi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fichiers .dll ISAPI devant être chargés au démarrage |
| **Syntaxe** | `ISAPICacheFile chemin-fichier [chemin-fichier] ...` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_isapi\|mod_isapi]] |

## Utilisation

Cette directive permet de spécifier une liste, séparés par des espaces, de noms de fichiers devant être chargés au démarrage du serveur Apache, et rester en mémoire jusqu'à l'arrêt du serveur. Cette directive peut être répétée pour chaque fichier .dll ISAPI souhaité. Le chemin complet du fichier doit être spécifié. Si le chemin n'est pas absolu, il sera considéré comme relatif au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

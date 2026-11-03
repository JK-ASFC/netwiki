---
title: "ScoreBoardFile"
description: "Directive Apache ScoreBoardFile (mpm_common) — Chemin du fichier où sont stockées les données concernant la coordination des processus enfants. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chemin du fichier où sont stockées les données concernant la coordination des processus enfants |
| **Syntaxe** | `ScoreBoardFile chemin fichier` |
| **Valeur par défaut** | `ScoreBoardFile logs/apache_runtime_status` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

Le serveur HTTP Apache utilise un tableau de bord pour la communication entre le processus parent et les processus enfants. Pour faciliter cette communication, certaines architectures nécessitent un fichier. En l'absence de cette directive, donc si aucun nom de fichier n'est spécifié, Apache httpd tentera tout d'abord de créer un tableau uniquement en mémoire (en utilisant la mémoire partagée anonyme) ; et si il n'y parvient pas, il tentera de créer un fichier sur disque (en utilisant la mémoire partagée à base de fichier). Si cette directive est utilisée, Apache httpd créera systématiquement un fichier sur disque.

**Exemple**

```apache
ScoreBoardFile /var/run/apache_runtime_status
```

Une mémoire partagée sous forme de fichier est utile pour les applications tierces qui nécessitent un accès direct au tableau de bord des processus.

Si vous utilisez un `ScoreBoardFile`, vous pourrez constater une amélioration des performances en le plaçant sur un disque virtuel en RAM. Assurez-vous cependant de tenir compte des mêmes avertissements que ceux concernant le chemin du fichier journal et la [[11-guides/06-divers/conseils-sur-la-securite|sécurité]].

## Voir aussi

- [[11-guides/01-generalites/arret-et-redemarrage-du-serveur-http-apache|Arrêter et redémarrer le serveur HTTP Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

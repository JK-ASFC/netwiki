---
title: "PidFile"
description: "Directive Apache PidFile (mpm_common) — Ficher dans lequel le serveur enregistre l'identificateur de processus du démon. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ficher dans lequel le serveur enregistre l'identificateur de processus du démon |
| **Syntaxe** | `PidFile nom fichier` |
| **Valeur par défaut** | `PidFile logs/httpd.pid` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

La directive `PidFile` permet de définir le ficher dans lequel le serveur enregistre l'identificateur de processus du démon. Si le chemin du fichier n'est pas absolu, il est considéré comme relatif au chemin défini par la directive [[13-directives/serverroot|ServerRoot]].

**Exemple**

```apache
PidFile /var/run/apache.pid
```

Il est souvent utile de pouvoir envoyer un signal au serveur afin qu'il ferme et ouvre à nouveau ses journaux d'`erreur` et de `transfert`, et recharge son fichier de configuration. Pour ce faire, on envoie un signal SIGHUP (kill -1) à l'identificateur de processus enregistré dans le fichier défini par la directive `PidFile`.

La directive `PidFile` fait l'objet des mêmes avertissements que ceux concernant le chemin d'enregistrement des fichiers journaux et la [[11-guides/06-divers/conseils-sur-la-securite|sécurité]].

> [!NOTE]
> **Note**
>
> Depuis la version 2 du serveur HTTP Apache, nous recommandons de n'utiliser que le script [[10-commandes/apachectl|apachectl]], ou le script de démarrage fourni avec votre système d'exploitation pour (re)démarrer ou arrêter le serveur.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

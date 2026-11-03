---
title: "CoreDumpDirectory"
description: "Directive Apache CoreDumpDirectory (mpm_common) — Le répertoire dans lequel le serveur HTTP Apache va tenter de se positionner avant d'effectuer un vidage mémoire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le répertoire dans lequel le serveur HTTP Apache va tenter de se positionner avant d'effectuer un vidage mémoire |
| **Syntaxe** | `CoreDumpDirectory répertoire` |
| **Valeur par défaut** | `Voir ci-dessous pour le répertoire par défaut` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

Cette directive permet de définir le répertoire dans lequel Apache httpd va tenter de se positionner avant d'effectuer un vidage mémoire sur disque. Si votre système d'exploitation est configuré pour créer des fichiers de vidage mémoire dans le répertoire de travail des processus qui se sont crashés, `CoreDumpDirectory` est nécessaire pour définir un répertoire de travail autre que le répertoire par défaut [[13-directives/serverroot|ServerRoot]], ce répertoire de travail ne devant pas être accessible en écriture par l'utilisateur sous lequel le serveur s'exécute.

Si vous avez besoin d'un vidage mémoire pour le débogage, vous pouvez utiliser cette directive pour le placer à un endroit différent. Cette directive n'a aucun effet si votre système d'exploitation n'est pas configuré pour créer des fichiers de vidage mémoire dans le répertoire de travail des processus qui se sont crashés.

> [!WARNING]
> **Note de sécurité pour les systèmes de type Linux**
>
> Utiliser cette directive sous Linux peut permettre aux autres processus du système s'exécutant avec les même privilèges (comme les scripts CGI) de se rattacher aux processus httpd enfants via l'appel système `ptrace`. La protection contre certaines attaques engageant la sécurité peut s'en trouver affectée. Il est par conséquent déconseillé d'utiliser cette directive sur les systèmes en production.

> [!NOTE]
> **Vidages mémoire sous Linux**
>
> Si Apache httpd est démarré sous l'utilisateur root puis bascule vers un autre utilisateur, le noyau Linux *désactive* les vidages mémoire, même si le répertoire est accessible en écriture au processus. Apache httpd (versions 2.0.46 et supérieures) réactive les vidages mémoire sous Linux 2.4 et au delà, mais seulement si vous définissez une directive `CoreDumpDirectory`.

> [!NOTE]
> **Vidages mémoire sous BSD**
>
> Pour activer le vidage mémoire des exécutables suid sur les systèmes de style BSD (comme FreeBSD), définissez `kern.sugid_coredump` à 1.

> [!NOTE]
> **Signaux spécifiques**
>
> `CoreDumpDirectory` n'est traité qu'à la reception d'un certain nombre de signaux , SIGFPE, SIGILL, SIGABORT, SIGSEGV, et SIGBUS.
>
> Sur certains systèmes d'exploitation, SIGQUIT provoque aussi un vidage mémoire, mais n'est pas traité par les directives `CoreDumpDirectory` ou `EnableExceptionHook`, si bien que la définition du répertoire d'enregistrement du vidage mémoire est entièrement dévolue au système d'exploitation.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

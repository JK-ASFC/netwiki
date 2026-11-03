---
title: "GprofDir"
description: "Directive Apache GprofDir (core) — Répertoire dans lequel écrire les données de profiling gmon.out. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Répertoire dans lequel écrire les données de profiling gmon.out. |
| **Syntaxe** | `GprofDir /tmp/gprof/\|/tmp/gprof/%` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Lorsque le serveur a été compilé avec le support du profiling gprof, la directive `GprofDir` permet de spécifier dans quel répertoire les fichiers `gmon.out` doivent être écrits lorsque le processus s'arrête. Si l'argument se termine par un caractère pourcentage ('%'), des sous-répertoires sont créés pour chaque identifiant de processus.

Cette directive ne fonctionne actuellement qu'avec le MPM [[12-modules/prefork|prefork]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

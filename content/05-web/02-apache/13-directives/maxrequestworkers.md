---
title: "MaxRequestWorkers"
description: "Directive Apache MaxRequestWorkers (mpm_common) — Nombre maximum de connexions pouvant être traitées simultanément. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximum de connexions pouvant être traitées simultanément |
| **Syntaxe** | `MaxRequestWorkers nombre` |
| **Valeur par défaut** | `Voir ci-dessous pour plus de détails` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

La directive `MaxRequestWorkers` permet de fixer le nombre maximum de requêtes pouvant être traitées simultanément. Si la limite `MaxRequestWorkers` est atteinte, toute tentative de connexion sera normalement mise dans une file d'attente, et ceci jusqu'à un certain nombre dépendant de la directive [[13-directives/listenbacklog|ListenBacklog]]. Lorsqu'un processus enfant se libèrera suite à la fin du traitement d'une requête, la connexion en attente pourra être traitée à son tour.

Pour les serveurs non threadés (*c'est à dire* utilisant [[12-modules/prefork|prefork]]), la directive `MaxRequestWorkers` définit alors le nombre maximum de processus enfants qui pourront être lancés simultanément pour traiter les requêtes. La valeur par défaut est `256` ; si vous l'augmentez, vous devez aussi augmenter la valeur de la directive [[13-directives/serverlimit|ServerLimit]].

Pour les serveur threadés et hybrides (utilisant *par exemple* [[12-modules/event|event]] ou [[12-modules/worker|worker]]), `MaxRequestWorkers` définit alors le nombre total de threads qui seront disponibles pour servir les clients. Pour les MPMs hybrides et threadés, la valeur par défaut est `16` (directive [[13-directives/serverlimit|ServerLimit]]) multiplié par la valeur `25` (directive [[13-directives/threadsperchild|ThreadsPerChild]]). Par conséquent, pour affecter à la directive `MaxRequestWorkers` une valeur qui requiert plus de 16 processus, vous devez aussi augmenter la valeur de la directive [[13-directives/serverlimit|ServerLimit]].

Pour les MPMs threadés et hybrides, la valeur de la directive `MaxRequestWorkers` doit supérieure ou égale à celle de la directive [[13-directives/threadsperchild|ThreadsPerChild]] et doit être un multiple entier de cette dernière. Si elle n’est pas un multiple de cette dernière, le serveur l’arrondit par le bas au démarrage au multiple le plus proche et journalise un avertissement.

**Avertissement : MaxRequestWorkers trop petit**

```
WARNING: MaxRequestWorkers of 10 is less than ThreadsPerChild
of 25, increasing to 25. MaxRequestWorkers must be at least as
large as the number of threads in a single server.
```

**Avertissement : MaxRequestWorkers n’est pas un multiple de ThreadsPerChild**

```
WARNING: MaxRequestWorkers of 90 is not an integer multiple of
ThreadsPerChild of 25, decreasing to nearest multiple 75, for a
maximum of 3 servers.
```

Le nom de la directive `MaxRequestWorkers` était `MaxClients` avant la version 2.3.13. Cet ancien nom est encore supporté.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

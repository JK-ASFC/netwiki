---
title: "Mutex"
description: "Directive Apache Mutex (core) — Définit les mécanismes de mutex et le repertoire du fichier verrou pour tous les mutex ou seulement les mutex spécifiés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit les mécanismes de mutex et le repertoire du fichier verrou pour tous les mutex ou seulement les mutex spécifiés |
| **Syntaxe** | `Mutex mécanisme [default\|nom-mutex] ... [OmitPID]` |
| **Valeur par défaut** | `Mutex default` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible depuis la version 2.3.4 du serveur HTTP Apache |

## Utilisation

La directive `Mutex` permet de définir le mécanisme de mutex, et éventuellement le répertoire du fichier verrou que les modules et httpd utilisent pour sérialiser l'accès aux ressources. Spécifiez `default` comme second argument pour modifier la configuration de tous les mutex ; spécifiez un nom de mutex (voir la table ci-dessous) comme second argument pour ne modifier que la configuration de ce mutex.

La directive `Mutex` est typiquement utilisée dans les situations exceptionnelles suivantes :

- choix d'un autre mécanisme de mutex lorsque le mécanisme par défaut sélectionné par APR présente un problème de fonctionnement ou de performances.
- choix d'un autre répertoire utilisé par les mutex à base de fichier lorsque le répertoire par défaut ne supporte pas le verrouillage

> [!NOTE]
> **Modules supportés**
>
> Cette directive ne configure que les mutex qui ont été enregistrés avec le serveur de base via l'API `ap_mutex_register()`. Tous les modules fournis avec httpd supportent la directive `Mutex`, mais il n'en sera pas forcément de même pour les modules tiers. Reportez-vous à la documentation du module tiers considéré afin de déterminer le(s) nom(s) de mutex qui pourront être définis si la directive est supportée.

Les *mécanismes* de mutex disponibles sont les suivants :

- `default | yes`

  C'est l'implémentation du verrouillage par défaut, telle qu'elle est définie par APR. On peut afficher l'implémentation du verrouillage par défaut via la commande [[10-commandes/httpd|httpd]] avec l'option `-V`.
- `none | no`

  Le mutex est désactivé, et cette valeur n'est permise pour un mutex que si le module indique qu'il s'agit d'un choix valide. Consultez la documentation du module pour plus d'informations.
- `posixsem`

  Une variante de mutex basée sur un sémaphore Posix.

  > [!WARNING]
  > **Avertissement**
  >
  > La propriété du sémaphore n'est pas restituée si un thread du processus gérant le mutex provoque une erreur de segmentation, ce qui provoquera un blocage du serveur web.
- `sysvsem`

  Une variante de mutex basée sur un sémaphore IPC SystemV.

  > [!WARNING]
  > **Avertissement**
  >
  > Il peut arriver que les sémaphores SysV soient conservés si le processus se crashe avant que le sémaphore ne soit supprimé.

  > [!WARNING]
  > **Sécurité**
  >
  > L'API des sémaphores permet les attaques par déni de service par tout programme CGI s'exécutant sous le même uid que le serveur web (autrement dit tous les programmes CGI, à moins que vous n'utilisiez un programme du style [[10-commandes/suexec|suexec]] ou `cgiwrapper`).
- `sem`

  Sélection de la "meilleure" implémentation des sémaphores disponible ; le choix s'effectue entre les sémaphores posix et IPC SystemV, dans cet ordre.
- `pthread`

  Une variante de mutex à base de mutex de thread Posix inter-processus.

  > [!WARNING]
  > **Avertissement**
  >
  > Sur la plupart des systèmes, si un processus enfant se termine anormalement alors qu'il détenait un mutex qui utilise cette implémentation, le serveur va se bloquer et cesser de répondre aux requêtes. Dans ce cas, un redémarrage manuel est nécessaire pour récupérer le mutex.
  >
  > Solaris et Linux constituent des exceptions notables, en ceci qu'ils fournissent un mécanisme qui permet en général de récupérer le mutex après l'arrêt anormal d'un processus enfant qui détenait le mutex.
  >
  > Si votre système est compatible POSIX ou implémente la fonction `pthread_mutexattr_setrobust_np()`, vous devriez pouvoir utiliser l'option `pthread` sans problème.
- `fcntl:/chemin/vers/mutex`

  Une variante de mutex utilisant un fichier verrou physique et la fonction `fcntl()`.

  > [!WARNING]
  > **Avertissement**
  >
  > Lorsqu'on utilise plusieurs mutex basés sur ce mécanisme dans un environnement multi-processus, multi-thread, des erreurs de blocage (EDEADLK) peuvent être rapportées pour des opérations de mutex valides si la fonction `fcntl()` ne gère pas les threads, comme sous Solaris.
- `flock:/chemin/vers/mutex`

  Méthode similaire à `fcntl:/chemin/vers/mutex`, mais c'est la fonction `flock()` qui est utilisée pour gérer le verrouillage par fichier.
- `file:/chemin/vers/mutex`

  Sélection de la "meilleure" implémentation de verrouillage par fichier disponible ; le choix s'effectue entre `fcntl` et `flock`, dans cet ordre.

La plupart des mécanismes ne sont disponibles que sur les plate-formes où ces dernières et APR les supportent. Les mécanismes qui ne sont pas disponibles sur toutes les plate-formes sont *posixsem*, *sysvsem*, *sem*, *pthread*, *fcntl*, *flock*, et *file*.

Avec les mécanismes à base de fichier *fcntl* et *flock*, le chemin, s'il est fourni, est un répertoire dans lequel le fichier verrou sera créé. Le répertoire par défaut est le répertoire d'exécution de httpd relatif à la directive [[13-directives/serverroot|ServerRoot]]. Utilisez toujours un système de fichiers local sur disque pour `/chemin/vers/mutex` et jamais un répertoire se trouvant dans un système de fichiers NFS ou AFS. Le nom de base du fichier se composera du type de mutex, d'une chaîne optionnelle correspondant à l'instance et fournie par le module ; et, sauf si le mot-clé `OmitPID` a été spécifié, l'identificateur du processus parent httpd sera ajouté afin de rendre le nom du fichier unique, évitant ainsi tout conflit lorsque plusieurs instances d'httpd partagent le même répertoire de verrouillage. Par exemple, si le nom de mutex est `mpm-accept`, et si le répertoire de verrouillage est `/var/httpd/locks`, le nom du fichier verrou pour l'instance httpd dont le processus parent a pour identifiant 12345 sera `/var/httpd/locks/mpm-accept.12345`.

> [!WARNING]
> **Sécurité**
>
> Il est conseillé d'*éviter* de placer les fichiers mutex dans un répertoire où tout le monde peut écrire comme `/var/tmp`, car quelqu'un pourrait initier une attaque par déni de service et empêcher le serveur de démarrer en créant un fichier verrou possédant un nom identique à celui que le serveur va tenter de créer.

La table suivante décrit les noms de mutex utilisés par httpd et ses modules associés.

| Nom mutex | Module(s) | Ressource protégée |
| --- | --- | --- |
| `mpm-accept` | modules MPM [[12-modules/prefork\|prefork]] et [[12-modules/worker\|worker]] | connexions entrantes, afin d'éviter le problème de l'afflux de requêtes ; pour plus d'informations, voir la documentation [[11-guides/06-divers/optimisation-des-performances-d-apache\|Amélioration des performances]] |
| `authdigest-client` | [[12-modules/mod_auth_digest\|mod_auth_digest]] | liste de clients en mémoire partagée |
| `authdigest-opaque` | [[12-modules/mod_auth_digest\|mod_auth_digest]] | compteur en mémoire partagée |
| `ldap-cache` | [[12-modules/mod_ldap\|mod_ldap]] | cache de résultat de recherche LDAP |
| `rewrite-map` | [[12-modules/mod_rewrite\|mod_rewrite]] | communication avec des programmes externes d'associations de valeurs, afin d'éviter les interférences d'entrées/sorties entre plusieurs requêtes |
| `ssl-cache` | [[12-modules/mod_ssl\|mod_ssl]] | cache de session SSL |
| `ssl-stapling` | [[12-modules/mod_ssl\|mod_ssl]] | cache de l'étiquetage OCSP ("OCSP stapling") |
| `watchdog-callback` | [[12-modules/mod_watchdog\|mod_watchdog]] | fonction de rappel d'un module client particulier |

Le mot-clé `OmitPID` permet d'empêcher l'addition de l'identifiant du processus httpd parent au nom du fichier verrou.

Dans l'exemple suivant, le mécanisme de mutex pour le mutex mpm-accept est modifié pour passer du mécanisme par défaut au mécanisme `fcntl`, avec le fichier verrou associé créé dans le répertoire `/var/httpd/locks`. Le mécanisme de mutex par défaut pour tous les autres mutex deviendra `sysvsem`.

```apache
Mutex sysvsem default
Mutex fcntl:/var/httpd/locks mpm-accept
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

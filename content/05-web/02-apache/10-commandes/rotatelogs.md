---
title: "rotatelogs"
description: "Commande rotatelogs d’Apache HTTP Server — rotatelogs - Rotation des journaux d'Apache par redirection de ces derniers dans un \"pipe\" : syntaxe, options et exemples."
tags: [apache, commande, rotatelogs]
icon: terminal
---

*rotatelogs - Rotation des journaux d'Apache par redirection de ces derniers dans un "pipe"*

[[10-commandes/rotatelogs|rotatelogs]] est un programme simple à utiliser en conjonction avec la fonctionnalité d'Apache de redirection dans un "pipe" des fichiers journaux. Il supporte une rotation basée sur un intervalle de temps ou une taille maximale du journal.

## Syntaxe

`rotatelogs [ -l ] [ -L nom-lien ] [ -p programme ] [ -f ] [ -D ] [ -t ] [ -v ] [ -e ] [ -c ] [ -n nombre-de-fichiers ] fichier-journal heure-de-rotation|taille-fichier(B|K|M|G) [ décalage ]`

## Options

**`-l`**

Utilise le temps local plutôt que GMT comme base pour l'intervalle de temps ou pour le formatage de `strftime(3)` avec une rotation basée sur la taille.

**`-L` *nom-lien***

Etablit un lien physique entre le fichier journal courant et le lien spécifié. Cette option permet de consulter le journal de manière continue malgré les rotations via une commande du style `tail -F nom-lien`.

Si le nom du lien spécifié n'est pas un chemin absolu, il est relatif au répertoire de travail de [[10-commandes/rotatelogs|rotatelogs]] qui correspond à la valeur de la directive [[13-directives/serverroot|ServerRoot]] lorsque la commande [[10-commandes/rotatelogs|rotatelogs]] est exécutée par le serveur.

**`-p` *programme***

Avec cette option, [[10-commandes/rotatelogs|rotatelogs]] exécutera le programme *programme* chaque fois qu'un nouveau fichier journal sera ouvert. Le nom du fichier nouvellement ouvert est passé comme premier argument au programme. Si l'exécution se produit après une rotation, l'ancien nom du fichier journal est passé au programme comme second argument. [[10-commandes/rotatelogs|rotatelogs]] n'attend pas la fin du *programme* pour continuer son exécution, et cessera tout enregistrement de codes d'erreur lorsqu'il aura terminé son processus. Le *programme* utilise les mêmes canaux stdin, stdout, et stderr que rotatelogs, et hérite de son environnement.

**`-f`**

Ouvre le fichier journal immédiatement, dès que [[10-commandes/rotatelogs|rotatelogs]] démarre, au lieu d'attendre la lecture de la première entrée de journal (pour les sites peu chargés, il peut s'écouler un temps substantiel entre le démarrage du serveur et le traitement de la première requête, temps pendant lequel le fichier journal associé n'"existe" pas, ce qui peut causer des problèmes à certains utilitaires de journalisation automatiques).

**`-D`**

Crée les répertoires parents du chemin du fichier journal s'ils n'existent pas déjà, ce qui permet d'utiliser le format `strftime(3)` dans les chemins au lieu du nom de fichier seul.

**`-t`**

Provoque une troncature du fichier journal au lieu d'une rotation. Cela peut s'avérer utile lorsqu'un journal est élaboré en temps réel par une commande telle que tail, l'archivage des données n'étant ici pas nécessaire. Si aucun suffixe n'est ajouté au nom de fichier, les chaînes de format contenant des caractères '%' sont cependant respectées.

**`-T`**

Provoque la troncature de tous les fichiers journaux lors de leur ouverture, à l'exception du fichier journal initial. Cela s'avère utile lorsque la chaîne de formatage contient quelque chose qui va se répéter de manière cyclique, comme le jour du mois par exemple. Disponible à partir de la version 2.4.56 du serveur HTTP Apache.

**`-v`**

Affiche une sortie verbeuse sur STDERR. La sortie contient le résultat de l'interprétation de la configuration, ainsi que toutes les opérations d'ouverture et de fermeture de fichiers.

**`-c`**

Crée un fichier journal pour chaque intervalle, même s'il est vide.

**`-e`**

Envoie les messages de journalisation vers stdout. Ceci s'avère utile lorsque les journaux doivent être traités par un autre programme.

**`-n nombre-de-fichiers`**

Utilise une liste circulaire de noms de fichiers sans repères de temps. Cette option permet d'écraser des fichiers journaux au démarrage et au cours de la rotation. Avec -n 3, la série de fichiers conservés sera "logfile", "logfile.1", "logfile.2" avec écrasement de "logfile".
Lorsque ce programme ouvre « logfile », ce dernier sera seulement tronqué si l'option `-t` est aussi spécifiée. Toute rotation subséquente sera précédée d'une troncature du fichier cible. Dans le cas d'une rotation basée sur la taille sans l'option `-t` et si des fichiers journaux sont déjà en place, cette option peut provoquer des résultats inattendus comme l'envoi des entrées de journal initiales vers « logfile.1 », les entrées de « logfile.1 » n'étant pas conservées, même si des fichiers « logfile.n » n'ont pas encore été utilisés.
Disponible à partir de la version 2.4.5 du serveur HTTP Apache.

**`fichier-journal`**

Le chemin et le nom de base du fichier journal. Si *fichier-journal* contient des caractères '%', il est considéré comme une chaîne de formatage pour `strftime(3)`. Dans le cas contraire, le suffixe *.nnnnnnnnnn* est automatiquement ajouté et correspond au temps en secondes (sauf si l'option -t est spécifiée). Les deux formats calculent le temps de démarrage depuis le début de la période courante. Par exemple, si un temps de rotation de 86400 est spécifié, les champs heure, minute et seconde créés à partir du format `strftime(3)` auront tous pour valeur 0, en référence au début de la période de 24 heures courante (minuit).

Si vous utilisez le formatage de noms de fichiers `strftime(3)`, assurez-vous que le format du fichier journal possède une granularité suffisamment importante pour générer un nom de fichier différent à chaque rotation des journaux. Si ce n'est pas le cas, la rotation va écraser le fichier existant au lieu d'en générer un nouveau. Par exemple, si *fichier-journal* était `/var/log/errorlog.%Y-%m-%d` avec une rotation à 5 mégaoctets, et si la limite de 5 mégaoctets a été atteinte deux fois dans la même journée, le même nom de fichier va être généré, et la rotation va écraser le fichier existant.

Si le nom du fichier journal n'est pas un chemin absolu, il est relatif au répertoire de travail de [[10-commandes/rotatelogs|rotatelogs]] qui correspond à la valeur de la directive [[13-directives/serverroot|ServerRoot]] lorsque la commande [[10-commandes/rotatelogs|rotatelogs]] est exécutée par le serveur.

**`temps-rotation`**

Le temps entre deux rotations des fichiers journaux en secondes. La rotation intervient au début de cet intervalle. Par exemple, si le temps de rotation est de 3600, la rotation des fichiers journaux s'effectuera au début de chaque heure ; si le temps de rotation est de 86400, la rotation des fichiers journaux s'effectuera chaque nuit à minuit. (Si aucune donnée n'est enregistrée au cours d'un intervalle, aucun fichier ne sera créé).

**`taille-fichier(B|K|M|G)`**

La taille maximale du fichier suivie par une des lettres `B` (Octets), `K` (KOctets), `M` (MOctets) ou `G` (GOctets).

Lorsque temps et taille sont spécifiés, la taille doit l'être après le temps. La rotation interviendra alors aussitôt que l'une des deux limites (temps ou taille) sera atteinte.

**`décalage`**

Le décalage en minutes par rapport au temps UTC. Par défaut, le décalage est considéré comme nul et c'est le temps UTC qui est utilisé. Par exemple, pour utiliser le temps local de la zone UTC -5 heures, spécifiez une valeur de `-300` pour cette option. Dans la plupart des cas, il vaut mieux utiliser l'option `-l` que spécifier un décalage.

## Exemples

```apache
CustomLog "|bin/rotatelogs /var/log/fichier-journal 86400" common
```

Cette directive crée les fichiers /var/log/fichier-journal.nnnn où nnnn correspond au temps système auquel la journalisation démarre effectivement (ce temps sera toujours un multiple du temps de rotation, si bien que vous pouvez synchroniser les scripts cron avec lui). A la fin de chaque temps de rotation (ici après 24 heures), une nouvelle journalisation démarre.

```apache
CustomLog "|bin/rotatelogs -l /var/log/fichier-journal.%Y.%m.%d 86400" common
```

Cette directive crée les fichiers /var/log/fichier-journal.yyyy.mm.dd où yyyy correspond à l'année, mm au mois et dd au jour du mois. La journalisation basculera vers un nouveau fichier chaque jour à minuit, temps local.

```apache
CustomLog "|bin/rotatelogs /var/log/fichier-journal 5M" common
```

Cette directive va effectuer une rotation du fichier journal chaque fois que la taille de ce dernier atteindra 5 MOctets.

```apache
ErrorLog "|bin/rotatelogs /var/log/journal-erreurs.%Y-%m-%d-%H_%M_%S 5M"
```

Cette directive va effectuer une rotation du fichier journal des erreurs chaque fois que la taille de ce dernier atteindra 5 MOctets, et le nom du fichier journal se présentera sous la forme `journal-erreurs.YYYY-mm-dd-HH_MM_SS`.

```apache
CustomLog "|bin/rotatelogs -t /var/log/journal 86400" common
```

Cet exemple crée le fichier `/var/log/journal` en le tronquant au démarrage, puis une fois par jour. Ce scénario implique qu'un processus séparé (tel que tail) traite le fichier en temps réel.

```apache
CustomLog "|bin/rotatelogs -T /var/log/logfile.%d 86400" common
```

Si le serveur est démarré ou redémarré le premier du mois, cela s'ajoute à la fin de `/var/log/logfile.01`. Lorsqu'une entrée de journal est écrite le deux du mois, `/var/log/logfile.02` est tronqué et les nouvelles entrées seront ajoutées à partir du début du fichier. Cet exemple conserve environ 1 mois de journaux sans nécessiter de maintenance externe.

## Portabilité

Les substitutions des chaînes de format du fichier journal suivantes doivent être supportées par toutes les implémentations de `strftime(3)` ; voir la page de manuel de `strftime(3)` pour les extensions spécifiques à une bibliothèque.

|   |   |
| --- | --- |
| `%A` | nom du jour de la semaine en entier (localisé) |
| `%a` | nom du jour de la semaine sur 3 caractères (localisé) |
| `%B` | nom du mois en entier (localisé) |
| `%b` | nom du mois sur 3 caractères (localisé) |
| `%c` | date et heure (localisé) |
| `%d` | jour du mois sur 2 chiffres |
| `%H` | heure sur 2 chiffres (de 0 à 24h) |
| `%I` | heure sur 2 chiffres (de 0 à 12h) |
| `%j` | jour de l'année sur 3 chiffres |
| `%M` | minutes sur 2 chiffres |
| `%m` | mois sur 2 chiffres |
| `%p` | suffixe am/pm pour l'heure de 0 à 12h (localisé) |
| `%S` | secondes sur 2 chiffres |
| `%U` | semaine de l'année sur 2 chiffres (Dimanche est le premier jour de la semaine) |
| `%W` | semaine de l'année sur 2 chiffres (Lundi est le premier jour de la semaine) |
| `%w` | jour de la semaine sur 1 chiffre (Dimanche est le premier jour de la semaine) |
| `%X` | heure (localisée) |
| `%x` | date (localisée) |
| `%Y` | année sur 4 chiffres |
| `%y` | année sur 2 chiffres |
| `%Z` | nom de la zone de temps |
| `%%` | caractère littéral \`%' |

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

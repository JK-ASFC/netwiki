---
title: "split-logfile"
description: "Commande split-logfile d’Apache HTTP Server — split-logfile - Eclatement des journaux en fonction des serveurs virtuels : syntaxe, options et exemples."
tags: [apache, commande, split-logfile]
icon: terminal
---

*split-logfile - Eclatement des journaux en fonction des serveurs virtuels*

Ce script perl permet d'extraire un journal pour chaque serveur virtuel à partir d'un journal d'accès global du serveur web. Pour que ce script fonctionne, le premier champ de chaque ligne du journal global doit contenir l'identité du serveur virtuel ; ce champ aura été ajouté à la directive [[13-directives/logformat|LogFormat]] via la variable "`%v`".

## Mode d'emploi

Création d'un fichier journal comportant l'identité du serveur virtuel considéré :

```apache
LogFormat "%v %h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\"" combined_plus_vhost
CustomLog logs/access_log combined_plus_vhost
```

Un fichier journal sera créé dans le répertoire à partir duquel vous exécutez le script pour chaque serveur virtuel qui apparaît dans le journal global. Ces fichiers journaux seront nommés à partir du nom du serveur virtuel considéré, avec l'extension `.log`.

Le fichier journal global est lu depuis l'entrée standard stdin. Les entrées de ce journal sont alors ajoutées au journal du serveur virtuel correspondant.

```
split-logfile < access_log
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

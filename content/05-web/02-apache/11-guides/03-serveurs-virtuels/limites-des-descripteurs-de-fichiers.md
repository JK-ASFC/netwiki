---
title: "Limites des descripteurs de fichiers"
description: "Apache HTTP Server — Limites des descripteurs de fichiers. Quand de nombreux serveurs virtuels sont créés, Apache peut dépasser les limites en descripteurs de fichiers ('file descriptors', également appelés gestionnaires de fichiers) si chacun des serveurs virtuels utilise ses propres fichiers jour"
tags: [apache, guide]
icon: book-open
---

Quand de nombreux serveurs virtuels sont créés, Apache peut dépasser les limites en descripteurs de fichiers ('file descriptors', également appelés *gestionnaires de fichiers*) si chacun des serveurs virtuels utilise ses propres fichiers journaux. Le nombre total de descripteurs de fichiers utilisés par Apache est d'un par fichier journal, un pour chacune des autres directives de fichiers journaux, plus un nombre constant compris entre 10 et 20 pour son fonctionnement interne. Les systèmes d'exploitation Unix limitent le nombre de descripteurs de fichiers utilisables par processus ; une valeur courante pour cette limite est de 64, et cette valeur peut le plus souvent être augmentée.

Apache tente d'accroître cette valeur limite si nécessaire, mais sans y parvenir dans les cas suivants :

1. Le système d'exploitation ne permet pas l'utilisation d'appels systèmes `setrlimit()`.
2. L'appel `setrlimit(RLIMIT_NOFILE)` ne fonctionne pas sur votre système d'exploitation (c'est le cas sous Solaris 2.3).
3. Le nombre de descripteurs de fichiers nécessaires à Apache dépasse la limite physique du matériel.
4. Le système impose d'autres limites sur l'utilisation des descripteurs de fichiers, comme par exemple une limite sur les flux stdio, utilisables uniquement sur les descripteurs de fichiers inférieurs à 256. (sous Solaris 2).

En cas de problème, Vous pouvez :

- Réduire le nombre de fichiers journaux, en ne spécifiant aucun fichier journal dans les sections [[13-directives/virtualhost|<VirtualHost>]], en donc en envoyant les informations aux fichiers journaux du serveur principal (Voir Éclatement des fichiers journaux ci-dessous pour plus d'informations sur cette possibilité).
- Dans les cas 1 ou 2 (évoqués ci-dessus), augmentez la limite sur les descripteurs de fichiers avant le démarrage d'Apache, au moyen d'un script comme

  ```
  #!/bin/sh
   ulimit -S -n 100
   exec httpd
  ```

## Éclatement des fichiers journaux

Lorsque vous choisissez d'enregistrer les informations émanant de plusieurs serveurs virtuels dans un même fichier journal, vous voudrez ensuite pouvoir scinder ces informations à des fins de statistiques, par exemple, sur les différents serveurs virtuels. Il est possible de procéder de la manière suivante :

Tout d'abord, vous devez ajouter le nom du serveur virtuel à chaque entrée du journal. Ceci se paramètre au moyen de la directive [[13-directives/logformat|LogFormat]] et de la variable `%v`. Ajoutez cette variable au début de la chaîne de définition du format de journalisations :

```apache
LogFormat "%v %h %l %u %t \"%r\" %>s %b" vhost
CustomLog logs/multiple_vhost_log vhost
```

Cette configuration va provoquer la création d'un fichier de journalisation au format standard (CLF : 'Common Log Format'), mais dont chaque ligne débutera par le nom canonique du serveur virtuel (spécifié par la directive [[13-directives/servername|ServerName]]). (Voir [[12-modules/mod_log_config|mod_log_config]] pour d'autres informations sur la personnalisation des fichiers journaux.)

Au moment de séparer les informations du fichier journal en un fichier par serveur virtuel, le programme `split-logfile` peut être utilisé. Ce programme peut être trouvé dans le répertoire `support` de la distribution d'Apache.

Exécutez ce programme au moyen de la commande :

```
split-logfile < /logs/multiple_vhost_log
```

Une fois exécuté avec le nom du fichier contenant tous les journaux, ce programme va générer un fichier pour chacun des serveurs virtuels qui apparaît dans le fichier d'entrée. Chaque fichier en sortie est nommé `nomduserveur.log`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

---
title: "log_server_status"
description: "Commande log_server_status d’Apache HTTP Server — log_server_status - Enregistrement périodique de l'état du serveur : syntaxe, options et exemples."
tags: [apache, commande, log_server_status]
icon: terminal
---

*log\_server\_status - Enregistrement périodique de l'état du serveur*

Ce script perl a été conçu pour être exécuté à intervalles réguliers via un déclencheur de type cron. Il se connecte au serveur pour en extraire des informations quant à son état. Il formate ces informations sous la forme d'une seule ligne qu'il enregistre dans un fichier. Vous devez éditer la valeur des variables en tête de script afin de définir le chemin du fichier de sortie. Pour que ce script puisse fonctionner, [[12-modules/mod_status|mod_status]] doit au préalable être chargé et configuré.

## Mode d'emploi

Le script contient les sections suivantes :

```perl
my $wherelog = "/usr/local/apache2/logs/";  # Le fichier de sortie sera
                    # du style "/usr/local/apache2/logs/19960312"
my $server   = "localhost";        # Nom du serveur, par exemple "www.foo.com"
my $port     = "80";               # Port d'écoute du serveur
my $request = "/server-status/?auto";    # Requête à soumettre
```

Ces variables doivent contenir des valeurs correctes, et le gestionnaire `/server-status` doit être configuré pour le répertoire considéré. En outre, l'utilisateur qui exécute le script doit avoir les droits d'écriture sur le chemin du fichier de sortie.

L'exécution périodique du script via cron permet d'obtenir un jeu de rapports d'état qui pourra être utilisé à des fins d'analyse statistique.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

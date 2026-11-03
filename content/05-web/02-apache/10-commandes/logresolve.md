---
title: "logresolve"
description: "Commande logresolve d’Apache HTTP Server — logresolve - Résoud les adresses IP en noms d'hôtes dans les fichiers journaux d'Apache : syntaxe, options et exemples."
tags: [apache, commande, logresolve]
icon: terminal
---

*logresolve - Résoud les adresses IP en noms d'hôtes dans les fichiers journaux d'Apache*

[[10-commandes/logresolve|logresolve]] est un programme agissant après traitement pour résoudre les adresses IP dans les journaux d'accès d'Apache. Pour minimiser la charge de votre serveur de noms, logresolve possède son propre cache interne sous forme d'une table de hashage. Cela implique que chaque numéro IP ne fera l'objet d'une requête DNS que la première fois où il est rencontré dans le fichier journal.

Le programme reçoit le fichier journal sur son entrée standard. Les adresses IP doivent se trouver en tête de chaque ligne et doivent être séparées du reste de la ligne par un espace.

## Syntaxe

`logresolve [ -s nom-fichier ] [ -c ] < access_log > access_log.new`

## Options

**`-s nom-fichier`**

Spécifie le nom du fichier où seront enregistrées des statistiques.

**`-c`**

Avec cette option, [[10-commandes/logresolve|logresolve]] effectue certaines vérifications DNS : après avoir trouvé le nom d'hôte correspondant à une adresse IP, [[10-commandes/logresolve|logresolve]] effectue une recherche DNS sur ce nom d'hôte et vérifie si une des adresses IP trouvées correspond à l'adresse originale.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*

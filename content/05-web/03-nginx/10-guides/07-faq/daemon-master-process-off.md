---
title: "Puis-je utiliser nginx avec « daemon off » ou « master_process off » en production ?"
description: "Nginx — Puis-je utiliser nginx avec « daemon off » ou « master_process off » en production ?. Q : Puis-je utiliser nginx avec « daemon off » ou « master_process off » en production ?"
tags: [nginx, guide]
icon: book-open
---

Q : Puis-je utiliser nginx avec « daemon off » ou « master\_process off » en production ?

R : Les directives « daemon on|off » et « master\_process on|off » ont avant tout été conçues pour le développement du code de nginx.

Beaucoup utilisent « daemon off » en production, alors que ce n'était pas vraiment prévu pour cela. Depuis la version 1.0.9, on peut toutefois utiliser nginx en production avec « daemon off » sans risque. Attention : la mise à jour sans interruption n'est pas possible avec « daemon off ».

En environnement de développement, avec « master\_process off », nginx peut tourner au premier plan sans processus maître et s'arrêter simplement avec ^C (SIGINT). C'est un peu comme lancer Apache avec l'option de ligne de commande « X ». En revanche, il ne faut JAMAIS utiliser nginx en production avec « master\_process off ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

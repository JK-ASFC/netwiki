---
title: "Que signifie l'erreur suivante dans le journal : « accept() failed (53: Software caused connection abort) while accepting new connection on 0.0.0.0:80 » ?"
description: "Nginx — Que signifie l'erreur suivante dans le journal : « accept() failed (53: Software caused connection abort) while accepting new connection on 0.0.0.0:80 » ?. Q : Que signifie l'erreur suivante dans le journal : « accept() failed (53: Software caused connection abort) while accepting new connection on 0.0.0.0:80 » ?"
tags: [nginx, guide]
icon: book-open
---

Q : Que signifie l'erreur suivante dans le journal : « accept() failed (53: Software caused connection abort) while accepting new connection on 0.0.0.0:80 » ?

R : Ces erreurs proviennent de connexions que les clients ont fermées avant que nginx ait pu les traiter. Cela arrive par exemple quand l'utilisateur n'attend pas le chargement complet d'une page riche en images et clique sur un autre lien : son navigateur ferme alors toutes les connexions précédentes devenues inutiles. Cette erreur n'est pas critique.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

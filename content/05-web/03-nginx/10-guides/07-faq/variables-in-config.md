---
title: "Existe-t-il une bonne façon d'utiliser les variables de nginx comme macros pour raccourcir la configuration et en faire des modèles ?"
description: "Nginx — Existe-t-il une bonne façon d'utiliser les variables de nginx comme macros pour raccourcir la configuration et en faire des modèles ?. Q : Existe-t-il une bonne façon d'utiliser les variables de nginx comme macros pour raccourcir certaines sections de la configuration et les utiliser comme modèles ?"
tags: [nginx, guide]
icon: book-open
---

Q : Existe-t-il une bonne façon d'utiliser les variables de nginx comme macros pour raccourcir certaines sections de la configuration et les utiliser comme modèles ?

R : Les variables ne doivent pas servir de macros de modèles. Elles sont évaluées à l'exécution, pendant le traitement de chaque requête : elles coûtent donc bien plus cher qu'une configuration statique simple. Utiliser des variables pour stocker des chaînes statiques est aussi une mauvaise idée. Il vaut mieux générer les configurations par expansion de macros et directives « include », avec des outils externes comme sed + make ou tout autre mécanisme de modèles courant.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

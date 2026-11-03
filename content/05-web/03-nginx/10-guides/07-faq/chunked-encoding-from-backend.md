---
title: "Pourquoi nginx ne traite-t-il pas correctement les réponses encodées par morceaux (chunked) de mon serveur d'arrière-plan ?"
description: "Nginx — Pourquoi nginx ne traite-t-il pas correctement les réponses encodées par morceaux (chunked) de mon serveur d'arrière-plan ?. Q : Mon serveur d'arrière-plan semble envoyer des réponses HTTP/1.0 avec l'encodage par morceaux, mais nginx ne les traite pas correctement. Par exemple, j'utilise nginx devant mon application node.js et, au lieu du…"
tags: [nginx, guide]
icon: book-open
---

Q : Mon serveur d'arrière-plan semble envoyer des réponses HTTP/1.0 avec l'encodage par morceaux, mais nginx ne les traite pas correctement. Par exemple, j'utilise nginx devant mon application node.js et, au lieu du JSON pur du serveur d'arrière-plan, nginx renvoie quelque chose encadré de nombres décimaux comme

```c
47
{"error":"query error","message":"Parameter(s) missing: user,password"}
0
```

R : Votre serveur d'arrière-plan enfreint la spécification HTTP (voir [RFC 2616, « 3.6 Transfer Codings »](https://datatracker.ietf.org/doc/html/rfc2616#section-3.6)). L'encodage de transfert « chunked » ne doit pas être utilisé avec HTTP/1.0. Il faut soit corriger votre application, soit passer à nginx 1.1.4 ou plus récent, où du code a été ajouté pour gérer ce comportement erroné.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*

---
title: "Comment mentionner le copyright de nginx lorsqu'on l'intègre à un logiciel propriétaire distribué ?"
description: "Nginx — Comment mentionner le copyright de nginx lorsqu'on l'intègre à un logiciel propriétaire distribué ?. Q : Je souhaite intégrer la distribution de nginx à mon logiciel propriétaire. Comment mentionner le copyright de nginx dans ce cas ?"
tags: [nginx, guide]
icon: book-open
---

Q : Je souhaite intégrer la distribution de nginx à mon logiciel propriétaire. Comment mentionner le copyright de nginx dans ce cas ?

R : Le texte ci-dessous doit être ajouté à vos conditions de licence, suivi du texte de la licence BSD à 2 clauses applicable, décrite [ici](http://nginx.org/LICENSE).

```
This product contains software provided by Nginx, Inc. and its contributors.
```

Si votre compilation de nginx inclut aussi des produits tiers parmi zlib, PCRE et OpenSSL, il est conseillé d'inclure également leurs mentions de copyright et clauses de non-responsabilité.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
